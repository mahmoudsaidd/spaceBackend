import jwt from 'jsonwebtoken';
import { userModel } from '../../Database/model/user.model.js';

export const roles={
    User:"User",
    Admin:"Admin",
    Owner:"Owner"
}

export const auth=(acceptedRoles=[roles.user])=>{
    return async(req,res,next)=>{
        const{authorization}=req.headers;
        console.log(authorization);
        if(!authorization?.startsWith(process.env.BearerKey)){
            next(new Error("In-valid Bearer Key",{cause:400}))
        }else{
            const token =authorization.split(process.env.BearerKey)[1]
            const decoded=jwt.verify(token,process.env.tokenSignature)
            if(!decoded?.id || !decoded?.isLoggedIn ){
                next(new Error("In-valid token",{cause:400}))
            }else{
                const user=await userModel.findById(decoded.id).select("email userName role")
                if(!user){
                    next(new Error("Not registered user",{cause:404}))
                }else{
                    if(acceptedRoles.includes(user.role)){
                        req.user=user
                        next()
                    }else{
                        next(new Error("Not authorized user",{cause:403}))
                    }
                }
            }
        }
    }
}