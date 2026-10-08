export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error?.name === "CastError") {
    return response.status(404).json({ error: "The requested record was not found." });
  }

  if (error?.code === 11000) {
    return response.status(409).json({ error: "A record with those details already exists." });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) {
    console.error(error);
  }
  return response.status(status).json({
    error: status >= 500 ? "An unexpected server error occurred." : error.message
  });
}
