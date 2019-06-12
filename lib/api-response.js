/**
 * Created by jiangwei on 2019/6/12.
 * Copyright (c) 2019 (jw872505975@gmail.com). All rights reserved.
 */

/**
 * Represents Api response.
 */
class HttpResponse {
  constructor(code) {
    this.code = code;
  }
}

/**
 * Represents success response (:200)
 */
class SuccessResponse extends HttpResponse {
  constructor(data, code = 200) {
    super(code);
    this.data = data;
  }

  toJSON() {
    return {
      code: this.code,
      data: this.data
    };
  }
}

/**
 * ErrorResponse (:500)
 */
class ErrorResponse extends HttpResponse {
  constructor(message, code = 500) {
    super(code);
    this.message = message;
  }
  toJSON() {
    return {
      code: this.code,
      message: this.message
    };
  }
}

/**
 * Represents bad request (:400) response.
 */
class BadRequestResponse extends HttpResponse {
  constructor(errors) {
    super(400);
    this.errors = errors;
    this.message = "Bad Request";
  }

  toJSON() {
    return {
      errors: this.errors,
      code: this.code,
      message: this.message
    };
  }
}

/**
 * Represents not found (:404) response.
 */
class NotFoundResponse extends HttpResponse {
  constructor(message) {
    super(404);
    this.message = message || "Not Found";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message
    };
  }
}

/**
 * Represents auth (:401) error response.
 */
class AuthErrorResponse extends HttpResponse {
  constructor(message, code = 401) {
    super(code);
    this.message = message || "Authorization required";
    this.code = code;
  }
  toJSON() {
    return {
      code: this.code,
      message: this.message
    };
  }
}

/**
 * Middleware Function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function ResponseJson(req, res, next) {
  return (obj, req, res, next) => {
    if (obj instanceof HttpResponse || obj.code) {
        res.status(obj.code).json(obj);
    } else {
      res.status(500).send(`Internal Server Error:${obj.message}`);
    }
    next();
  };
}

module.exports = {
    HttpResponse, 
    SuccessResponse, 
    ErrorResponse, 
    BadRequestResponse, 
    NotFoundResponse, 
    AuthErrorResponse,
    ResponseJson
}