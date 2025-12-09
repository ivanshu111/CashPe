const mongoose = require("mongoose");
const { hashPassword } = require("../utils/hash");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be exactly 10 digits",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    pin: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{4}$/.test(v);
        },
        message: "Pin must be a 4-digit number",
      },
    },
    profilePicture: {
      type: String,
      default:
        "https://www.cielhr.com/wp-content/uploads/2020/10/dummy-image.jpg",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  if (this.isModified("pin")) {
    this.pin = await hashPassword(this.pin);
  }
});

module.exports = mongoose.model("User", userSchema);
