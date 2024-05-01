// use for mongodb error show case


module.exports = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}