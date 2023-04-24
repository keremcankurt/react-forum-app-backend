const CustomError = require("./customError");


const customErrorHandler = async(err,req,res,next) => {
    let customError = err;

    if(err && err.code === 11000){
        err.message = "email already used";
        customError = new CustomError(err.message,400);
    }
    else if(err.name === "ValidationError") {
        customError = new CustomError(err.message,400);
    }
    else if(err.name === "CastError"){
        customError = new CustomError("Please provide a valid id",400);
    }
    res.status(customError.status || 500).json({
        success: false,
        error: customError.message,
      });
}

module.exports = customErrorHandler;