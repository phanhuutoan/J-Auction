import * as Joi from 'joi';

export const signupValidationSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const signinValidationSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
