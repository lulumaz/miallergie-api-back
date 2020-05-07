const Joi = require('@hapi/joi');

export function validateRegister(data: {
  email: string;
  password: string;
  username: string;
}) {
  const schema = Joi.object({
    id: Joi.optional(),
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
}

export function validateEmail(data: {email: string}) {
  const schema = Joi.object({
    id: Joi.optional(),
    email: Joi.string().min(6).max(255).email().required(),
  });
  return schema.validate(data);
}
export function validateUsername(data: {username: string}) {
  const schema = Joi.object({
    id: Joi.optional(),
    username: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}
export function validatePassword(data: {password: string}) {
  const schema = Joi.object({
    id: Joi.optional(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
}
