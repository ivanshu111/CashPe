const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
const Wallet = require("./src/models/Wallet");

dotenv.config({ path: __dirname + "/.env" });

const ADMIN = {
  name: "Admin",
  email: "admin@cashpe.com",
  password: "admin123",
  phone: "9999999999",
  pin: "1234",
  role: "admin",
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log(`Admin user (${ADMIN.email}) already exists. Skipping.`);
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN.password, salt);
    const hashedPin = await bcrypt.hash(ADMIN.pin, salt);

    const admin = await User.create({
      name: ADMIN.name,
      email: ADMIN.email,
      password: hashedPassword,
      phone: ADMIN.phone,
      pin: hashedPin,
      role: "admin",
    });

    await Wallet.create({ user: admin._id, balance: 0 });

    console.log("Admin user created successfully:");
    console.log(`  Email:    ${ADMIN.email}`);
    console.log(`  Password: ${ADMIN.password}`);
    console.log(`  PIN:      ${ADMIN.pin}`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
