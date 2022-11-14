import validator from "validator";

const registerValidator = (data) => {
  const errors = {};

  if (data.email && !validator.isEmail(validator.trim(data.email))) {
    errors.email = "Email is invalid";
  }
  if (data.username && !validator.isLength(validator.trim(data.username), { min: 4 })) {
    errors.username = "Username must be at least 4 characters";
  }
  if (data.password && !validator.isLength(validator.trim(data.password), { min: 4 })) {
    errors.password = "Password must be at least 4 characters";
  }

  if (data.password && data.passwordConfirm && data.password !== data.passwordConfirm) {
    errors.password = "Passwords must be same";
  }

  return errors;
};

export default registerValidator;
