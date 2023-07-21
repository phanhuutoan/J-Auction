import * as Joi from 'joi';

export const createBidItemSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  timeWindow: Joi.number().min(1).required(),
  startPrice: Joi.number().min(0).required(),
});

export const startBidSchema = Joi.object({
  bidItemId: Joi.number().required(),
  timeWindow: Joi.number().required(),
  createdById: Joi.number().required(),
});

export const bidAuctionSchema = Joi.object({
  price: Joi.number().min(1).required(),
});
