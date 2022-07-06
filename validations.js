const { body } = require("express-validator");

const registerValidation = [
  body("email", "Please provide valid email!").isEmail(),
  body("password", "Please provide valid password!").isLength({ min: 5 }),
  body("fullName", "Please provide valid full name!").isLength({ min: 3 }),
  body("avatarUrl", "Please provide valid avatar url!").optional().isURL(),
];
const loginValidation = [
  body("email", "Please provide valid email!").isEmail(),
  body("password", "Please provide valid password!").isLength({ min: 5 }),
];
const postCreateValidation = [
  body("title", "Please provide title!").isLength({ min: 3 }).isString(),
  body("text", "Please provide some text!").isLength({ min: 10 }).isString(),
  body("tags", "Please provide some tags!").optional().isString(),
  body("imageUrl", "Please provide image url!").optional().isString(),
];
const commentCreateValidation = [
  body("commentaries", "Please provide valid commentaries").isLength({min: 5}).isString()
]

module.exports = { registerValidation, loginValidation, postCreateValidation,commentCreateValidation };
