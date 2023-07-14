import * as Joi from 'joi';

export const updateBalanceValidationSchema = Joi.object({
  balance: Joi.number().greater(0).required(),
});
