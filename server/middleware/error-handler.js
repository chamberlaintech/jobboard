import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  // handle known custom API errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  // handle mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: message });
  }

  // duplicate key error (Mongo)
  if (err.code && err.code === 11000) {
    const message = `Duplicate value for field: ${Object.keys(
      err.keyValue
    )}. Please use another value.`;
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: message });
  }

  // invalid ObjectId
  if (err.name === "CastError") {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No item found with id: ${err.value}` });
  }

  // everything else
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something went wrong, please try again later." });
};

export default errorHandlerMiddleware;