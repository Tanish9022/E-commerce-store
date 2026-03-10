import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  email: { type: String, required: true },
  products: [{
    id: String,
    name: String,
    price: Number,
    size: String,
    quantity: Number,
    customizationData: Object
  }],
  totalAmount: { type: Number, required: true },
  stripeSessionId: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
