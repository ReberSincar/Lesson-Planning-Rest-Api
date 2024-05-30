import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export const badRequest = (message?: string) => {
  throw new BadRequestException(message, { description: 'Bad Request!' });
};

export const unauthorized = (message?: string, body?: any) => {
  throw new UnauthorizedException(message, {
    description: 'Unauthorized!',
    ...body,
  });
};

export const paymentRequired = () => {
  throw new HttpException('Payment Required!', HttpStatus.PAYMENT_REQUIRED);
};

export const forbidden = (message?: string) => {
  throw new ForbiddenException(message, { description: 'Forbidden!' });
};

export const notFound = (message?: string) => {
  throw new NotFoundException(message, { description: 'Not Found!' });
};

export const notAcceptable = (message?: string) => {
  throw new NotAcceptableException(message, { description: 'Not Acceptable!' });
};

export const conflict = (message?: string) => {
  throw new ConflictException(message, { description: 'Conflict!' });
};

export const internalServerError = (message?: string, error?: Error) => {
  throw new InternalServerErrorException(message, {
    cause: error,
    description: 'Internal Server Error!',
  });
};

export const notImplemented = (message?: string) => {
  throw new NotImplementedException(message, {
    description: 'Not Implemented!',
  });
};

export const serviceUnavailable = (message?: string) => {
  throw new ServiceUnavailableException(message, {
    description: 'Service Unavailable!',
  });
};
