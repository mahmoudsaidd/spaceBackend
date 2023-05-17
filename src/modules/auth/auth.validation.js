import joi from 'joi'

export const signUpSchema={
    body:joi.object().required().keys({
        userName:joi.string().required().min(2).max(20),
        email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] }}),
        password:joi.string().pattern(new RegExp("^[A-Z][a-z0-9]{3,8}$"))
        .required().messages({
          "string.pattern.base":"Not matching pattern"
        }),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      phone:joi.string().pattern(new RegExp("^(011|012|010|015)[0-9]{8}$")).required()
    })
}


export const signInSchema={
    body:joi.object().required().keys({
        email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      password: joi
        .string()
        .pattern(new RegExp("^[A-Z][a-z0-9]{3,8}$"))
        .required().messages({
          "string.pattern.base":"Not matching pattern"
        }),
    })
}


export const forgetPasswordSchema={
  body:joi.object().required().keys({
    OTPCode:joi.string().required(),
      email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: joi
      .string()
      .pattern(new RegExp("^[A-Z][a-z0-9]{3,8}$"))
      .required().messages({
        "string.pattern.base":"Not matching pattern"
      }),
  })
}
