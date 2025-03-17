const asyncHandler = (fun) => async(req,res,next)=>{
    try{
        return await fun(req,res,next);
    }
    catch(error){
        res.status(error.code || 500).json({
            success : false,
            message : error.message
        })
    }
}

export {asyncHandler}


// Your asyncHandler function is a higher-order function that wraps an asynchronous function and handles any errors that occur, ensuring they are caught and returned in a consistent JSON response. This is useful for Express.js routes to avoid repetitive try-catch blocks.
