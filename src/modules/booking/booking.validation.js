import joi from 'joi'

export const createBookingSchema={
    body:joi.object().required().keys({
        room:joi.string().hex().length(24),
        startTime:joi.date(),
        endTime:joi.date().greater(joi.ref('startTime')).messages({"Error":"Invalid time"}),

    })
}


