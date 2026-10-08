export function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query
    });

    if (!result.success) {
      return response.status(400).json({
        error: "Please check the submitted information.",
        details: result.error.issues.map(({ path, message }) => ({
          field: path.join("."),
          message
        }))
      });
    }

    request.validated = result.data;
    return next();
  };
}
