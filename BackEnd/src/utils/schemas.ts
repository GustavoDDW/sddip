import Joi from 'joi';

export const createUserSchema = {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 }
  },
  required: ['userName', 'email', 'password']
};

export const createLoginchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email', 'password']
};
