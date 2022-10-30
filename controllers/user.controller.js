const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task.js");
const userController = {};

//Create a new user
userController.createUser = async (req, res, next) => {
  const info = req.body;
  const options = { new: true };
  try {
    //always remember to control your inputs
    if (!info || Object.keys(info).length === 0)
      throw new AppError(400, "Bad Request", "Create user error");
    //mongoose query
    const newUser = await User.create(info);

    if (info.tasks) {
      info.tasks.map(async (task) => {
        const assignedTask = await Task.findById(task);
        assignedTask.assignee = newUser._id;
        await assignedTask.save();
      });
    }

    await newUser.save();
    await sendResponse(
      res,
      200,
      true,
      { user: newUser },
      null,
      "Create User Successfully"
    );
  } catch (err) {
    next(err);
  }
};

//Get all users
userController.getUsers = async (req, res, next) => {
  const filter = { isDeleted: false };
  try {
    //mongoose query
    const users = await User.find(filter).populate("tasks");

    sendResponse(res, 200, true, users, null, "Get User List Successfully!");
  } catch (err) {
    next(err);
  }
};

//Search for a user by name
userController.searchUser = async (req, res, next) => {
  const { targetName } = req.params;

  try {
    const targetUser = await User.findOne({ name: targetName });
    //Express validator
    if (!targetUser) throw new AppError(400, "Bad Request", "No user found");

    sendResponse(res, 200, true, targetUser, null, "User Found");
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
