const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  preferences: {
    favoriteItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }],
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free']
    }],
    spicePreference: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra-hot']
    }
  },
  birthday: {
    type: Date
  },
  anniversary: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastVisit: {
    type: Date
  }
}, {
  timestamps: true
});

// Update customer stats when order is completed
customerSchema.methods.updateStats = function(orderTotal) {
  this.totalOrders += 1;
  this.totalSpent += orderTotal;
  this.loyaltyPoints += Math.floor(orderTotal / 100); // 1 point per ₹100
  this.lastVisit = new Date();
  return this.save();
};

// Index for better query performance
customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });

module.exports = mongoose.model('Customer', customerSchema);