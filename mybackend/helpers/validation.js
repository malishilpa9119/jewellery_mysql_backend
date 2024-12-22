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
      if (!req.file) {
        throw new Error("Please upload an image of type PNG, JPG, SVG, or GIF");
      }

      const validMimeTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
      const maxSize = 2 * 1024 * 1024; 

      if (!validMimeTypes.includes(req.file.mimetype)) {
        throw new Error("Please upload an image of type PNG, JPG, SVG, or GIF");
      }

      if (req.file.size > maxSize) {
        throw new Error("File size must be less than or equal to 2MB");
      }

      return true;
    }),
];
