function errorHandler(err,res,req,next){
    console.log(err.stack);
    const statusCode=err.status||'500'
    const message=err.message||'Interval Sever Error'
    res.status(statusCode).json({
        success: false,
        message,
      });
}
export default errorHandler