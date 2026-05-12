const ApiError = require("../utils/ApiError");

function validate(schema) {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        body: req.body,

        params: req.params,

        query: req.query,
      });

      req.validatedData = validatedData;

      next();
    } catch (err) {
      const errors = err.errors?.map((e) => ({
        field: e.path.join("."),

        message: e.message,
      }));

      next(new ApiError(400, errors?.[0]?.message || "Validation failed"));
    }
  };
}

module.exports = validate;
