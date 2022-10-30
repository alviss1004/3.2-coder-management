const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  searchUser,
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
 * @route GET api/users/:targetName
 * @description Get user by name
 * @access public
 */
router.get("/:targetName", searchUser);

//export
module.exports = router;
