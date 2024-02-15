const LogErrors = (err, req, res, next) => {
  console.log(err);
  next(err);
};

const BoomErrorHandler = (err, req, res, next) => {
  if (!err.isBoom) next(err);

  const { output } = err;
  res.status(output.statusCode).json(output.payload);
};

const InternalServerHandler = (err, req, res, next) => {
  res.status(500).json({
    message: "Internal Server error",
    statusCode: 500,
  });
};

module.exports = {
  LogErrors,
  BoomErrorHandler,
  InternalServerHandler,
};
