import { HttpStatus } from '@nestjs/common';

export const internalServerErrorSchema = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal Server Error',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Internal Server Error' },
      statusCode: { type: 'string', example: HttpStatus.INTERNAL_SERVER_ERROR },
    },
  },
};

export const badRequestErrorSchema = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Bad Request' },
      statusCode: { type: 'string', example: HttpStatus.BAD_REQUEST },
    },
  },
};

export const unauhorizedErrorSchema = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Unauhorized' },
      statusCode: { type: 'string', example: HttpStatus.UNAUTHORIZED },
    },
  },
};

export const forbiddenErrorSchema = {
  status: HttpStatus.FORBIDDEN,
  description: 'Forbidden',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Forbidden' },
      statusCode: { type: 'string', example: HttpStatus.FORBIDDEN },
    },
  },
};

export const notFoundErrorSchema = {
  status: HttpStatus.NOT_FOUND,
  description: 'Not Found',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: '{{x}} not found' },
      statusCode: { type: 'string', example: HttpStatus.NOT_FOUND },
    },
  },
};

export const notAcceptableErrorSchema = {
  status: HttpStatus.NOT_ACCEPTABLE,
  description: 'Not Acceptable',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Not Acceptable!' },
      statusCode: { type: 'string', example: HttpStatus.NOT_ACCEPTABLE },
    },
  },
};

export const conflictErrorSchema = {
  status: HttpStatus.CONFLICT,
  description: 'Conflict',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Conflict' },
      statusCode: { type: 'string', example: HttpStatus.CONFLICT },
    },
  },
};
