// throw  an error to user

class ExpressionError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressionError;