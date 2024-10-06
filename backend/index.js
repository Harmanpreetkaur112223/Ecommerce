import app from "./app.js";
import connectDb from "./database/db.js";

process.on("uncaughtException",err=>{
    console.log(`Error :- ${err.message}`)
    process.exit(1)
})

connectDb()
.then(()=>{
    try {
        app.listen(process.env.PORT || 8000 , ()=>{
            console.log(`server is listening on port http://localhost:${process.env.PORT || 8000}`)
        })
    } catch (error) {
        console.log("server connection error")
        process.exit(1)
    }
})
.catch(()=>{
    console.log("datbase connection error")
    process.exit(1)

})
// process.on('unhandledRejection',err=>{
//     console.log(`Error ${err.message}`)
//     process.exit(1)
// })