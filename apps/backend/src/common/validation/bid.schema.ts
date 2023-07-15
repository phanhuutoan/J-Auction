import * as Joi from 'joi';

export const createBidItemSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  timeWindow: Joi.number().min(1).required(),
});
