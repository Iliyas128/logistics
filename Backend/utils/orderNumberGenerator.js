const Counter = require('../models/Counter');

const generateOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'orderNumber' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq.toString().padStart(6, '0');
};

module.exports = { generateOrderNumber }; 