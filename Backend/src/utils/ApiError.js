class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong in server of saujanya",
        errors = [],
        stack = "",
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null;
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}


// Your apierror class is a custom error-handling class for an Express.js application. It extends the built-in Error class to provide a structured way to handle and return API errors.