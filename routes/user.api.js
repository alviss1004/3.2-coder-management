const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
} = require("../controllers/user.controller.js");

/**
 * @route GET API/users
 * @description Get a list of users
 * @access private
 */
router.get("/", getUsers);

/**
 * @route POST api/users
 * @description Create new user
 * @access private, assigner
 */
router.post("/", createUser);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:id", getUserById);

//export
module.exports = router;
