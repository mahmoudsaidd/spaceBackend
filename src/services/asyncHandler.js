

export function asyncHandler(fn){
    return(req,res,next)=>{
        fn(req,res,next).catch(err=>{
            return next(new Error(err.message,{cause:500}))
        })
    }
}

export const globalError=(err,req,res,next)=>{
    if(err){
        if(process.env.Env == "DEV"){
            return  res.status(err['cause'] || 500).json({
                message:err.message,
                stack:err.stack,
                status:err['cause'],
            })

        }
        else{
            return  res.status(err['cause'] || 500).json({
                message:err.message,
                status:err['cause']
            })
        }

    }
}