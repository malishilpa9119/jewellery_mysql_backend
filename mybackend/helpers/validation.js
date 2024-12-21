const { check } = require("express-validator");

exports.signUpValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").not().isEmpty(),
];
exports.loginValidation = [
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").not().isEmpty(),
];
exports.updateProfileValidation = [
  check("email", "Please enter a valid mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").not().isEmpty(),
];
exports.imageValidation = [
  check("category", "category is required").not().isEmpty(),
  check("imageUrl")
    .custom((value, { req }) => {
        
      if (
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/png" ||
        req.file.mimetype == "image/svg+xml" ||
        req.file.mimetype == "image/gif"
      ) {
        return true;
      } else {
        return false;
      }
     
    })
    .withMessage("Please upload an image type PNG, JPG"),
];
