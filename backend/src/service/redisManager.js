const IORedis = require("ioredis");

const publisher = new IORedis(process.env.REDIS_URI);
const subscriber = new IORedis(process.env.REDIS_URI);

// Prevent crashes on connection error
publisher.on('error', (err) => {
  console.error('Redis Publisher Error:', err);
});

subscriber.on('error', (err) => {
  console.error('Redis Subscriber Error:', err);
});

const NOTIFICATION_CHANNEL = "notifications";

const publishNotification = async (notification) => {
  console.log(`publishing notification for user ${notification.userId}`);
  await publisher.publish(NOTIFICATION_CHANNEL, JSON.stringify(notification));
};

module.exports = {
  subscriber,
  publishNotification,
  NOTIFICATION_CHANNEL,
};
