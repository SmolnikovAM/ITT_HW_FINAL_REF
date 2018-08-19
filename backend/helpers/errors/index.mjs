class NotAuthorizedError extends Error {}

class ValidationError extends Error {}

class NotFoundError extends Error {}

export default { NotAuthorizedError, ValidationError, NotFoundError };
