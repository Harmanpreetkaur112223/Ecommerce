import Product from "../models/productModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// create the product -- admin

const createProduct = asyncHandler(async (req, res, next) => {

    const data = req.body;
    const product = new Product(data);
    const response = await product.save();
    res.status(201).json(response)



})


// get all the products

const getProduct = asyncHandler(async (req, res, next) => {
    // req.body.user = req.user._id;
    let resultPerPage = 3;
    let apifeatures = new  ApiFeatures(Product.find() , req.query).search().filter().pagination(resultPerPage)
    const allProducts = await apifeatures.query;
    // if(!allProducts)return(next(ErrorHandler("Producrts not found",500)))
    res.status(200).json({ message: allProducts })


})

// update the product --admin
const updateProduct = asyncHandler(async (req, res, next) => {

    const id = req.params.id;
    let product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("could not find the product", 500))
    product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    res.status(200).json(product)


})

// get the individual product
const getIndividualProduct = asyncHandler(async (req, res, next) => {

    const id = req.params.id;
    const response = await Product.findById(id);
    if (!response) return next(new ErrorHandler("Product not found", 500))
    res.status(200).json(response)

})

// delete the product --admin
const deleteProduct = asyncHandler(async (req, res, next) => {

    const elem = await Product.findById(req.params.id);
    if (!elem) return next(new ErrorHandler("product not found", 500))
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted")

})

const createProductReview = asyncHandler(async (req , res , next)=>{
    const{rating , comment , productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating,
        comment,
    }

    const product = await Product.findById(productId);
    console.log(product)
    console.log(req.user)
   
    // if(product.reviews.length >0){
    //     isReviewed = product.reviews.forEach(rev=>rev._id.toString() === req.user._id.toString())
    // }
    let isReviewed  = product.reviews.some(rev => rev.user._id.toString() === req.user._id.toString());
        
    console.log(isReviewed)
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user._id.toString()===req.user._id.toString())
            {
                rev.rating = rating;
                rev.comment = comment
            }
            // console.log(product.reviews,"if sss")
        })
    }
    else{
        product.reviews.push(review);
        // console.log(product.reviews,"else ss")

        product.numberOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev=>{
        avg = avg+rev.rating;
    })
    product.ratings =avg/(product.reviews.length)
    await product.save({validateBeforeSave:false})
    res.status(200).json({success:true})
})


const showAllreviews = asyncHandler(async (req , res , next)=>{
    const {productId} = req.query;
    const product = await Product.findById(productId);
    if(!product) return next(new ErrorHandler("The product not found",404)); 
    const reviews = product.reviews;
    res.status(200).json({reviews:reviews,success:true})
})

const deleteReview = asyncHandler(async(req , res , next)=>{
    const{productId , reviewId} = req.query;
    let product = await Product.findById(productId);
    if(!product) return next(new ErrorHandler("product not found",404));
    const reviews = product.reviews.filter((rev)=>rev._id.toString() !== reviewId);
    const sum = reviews.reduce((acc,currRev)=>acc+currRev.rating,0);
  const ratings = sum/(reviews.length);
    const numberOfReviews = reviews.length;
    product = await Product.findByIdAndUpdate(productId,{ratings,numberOfReviews,reviews},{new:true})
    console.log(product)
    const response= await product.save();
    res.status(200).json({product:response,success:true})

})
export { createProduct, getProduct, updateProduct, getIndividualProduct, deleteProduct ,createProductReview , showAllreviews,deleteReview};