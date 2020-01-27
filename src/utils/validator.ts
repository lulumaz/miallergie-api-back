const Joi = require('@hapi/joi');

export function validateRegister(data: {
  email: string;
  password: string;
  username: string;
}) {
  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .max(255)
      .required(),
    email: Joi.string()
      .min(6)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
  });
  return schema.validate(data);
}
