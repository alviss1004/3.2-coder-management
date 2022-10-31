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
  let { page, limit, name } = req.query;
  const filter = { isDeleted: false };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  if (name) filter.name = name;

  try {
    //mongoose query
    let users = await User.find(filter).populate("tasks");
    //Express validator
    if (!users) throw new AppError(400, "Bad Request", "No user found");

    let offset = limit * (page - 1);
    users = users.slice(offset, offset + limit);

    sendResponse(res, 200, true, users, null, "Get User List Successfully!");
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
