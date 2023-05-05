
import joi from "joi"
export const updatePasswordSchema={
    body:joi.object().required().keys({
        userName:joi.string().min(2).max(20),
        email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}),
        currentPassword:joi.string().pattern(new RegExp("^[A-Z][a-z0-9]{3,8}$")),
        newPassword:joi.string().pattern(new RegExp("^[A-Z][a-z0-9]{3,8}$")),
        newCPassword:joi.string().valid(joi.ref('newPassword'))
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required()
    }
    ).unknown(true)
}