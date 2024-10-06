import Order from "../models/orderModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create the order --admin
const createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orders,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
   
  } = req.body;
  const user = req.user._id;
  const order = await Order.create(
    {
        shippingInfo,
        orders,
        user,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus,
        paidAt:Date.now(),
      }
  )
  const response = await order.save();
  res.status(200).json({message:"done",response,})
});

const getOrder = asyncHandler(async(req  , res , next)=>{
  const order = await Order.findById(req.params.id).populate("user","name email");
  if(!order)return next(new ErrorHandler("No order found",404))
  
    res.status(200).json(order)
})

const myOrders = asyncHandler(async(req , res , next)=>{
  // console.log(req.user._id)
  const orders = await Order.find({user:req.user._id})
  if(!orders)return next(new ErrorHandler("No order found",404))
  
    res.status(200).json(orders)
})

const getAllUsersOrders = asyncHandler(async(req , res , next)=>{
  const allOrders = await Order.find();
  if(!allOrders)return next(new ErrorHandler("No order found",404))
   
    let totalAmount= allOrders.reduce((acc , order)=>acc+=order.totalPrice , 0)
    res.status(200).json({allOrders,totalAmount})
})

export {createOrder,getOrder,myOrders,getAllUsersOrders}