import ErrorResponse from '../utils/errorResponse.js';

const validateJOI = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);
  return error ? next(new ErrorResponse(error.message, 400)) : next();
};

export default validateJOI;
