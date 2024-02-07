const successResponse = (res, data, message, statusCode = 201) => {
  res.status(statusCode).json({
    message,
    data: data,
  })
};

module.exports = successResponse;