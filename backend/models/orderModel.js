import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      pinCode: { type: Number, required: true },
      phoneNumber: { type: Number, required: true },
    },
  },

  orders: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        
      },
      image: { type: String, required: true },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["Order Confirmed", "Shipped", "Out For Delievery", "Delievered"],
    default: "Delievered",
  },
  delieveredAt:Date,
  createdAt:{
    type:Date,
    default:Date.now,
  }
});

const Order = mongoose.model("Order" , orderSchema)
export default Order