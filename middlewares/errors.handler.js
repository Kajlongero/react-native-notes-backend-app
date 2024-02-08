const LogErrors = (err, req, res, next) => {
  next(err);
};

const BoomErrorHandler = (err, req, res, next) => {
  if (!err.isBoom) next(err);

  const { output } = err;
  res.status(output.statusCode).json(output.payload);
};

const InternalServerHandler = (err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    statusCode: 500,
  });
};

module.exports = {
  LogErrors,
  BoomErrorHandler,
  InternalServerHandler,
};
