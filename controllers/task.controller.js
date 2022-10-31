const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
const User = require("../models/User");
const Task = require("../models/Task.js");
const taskController = {};

//Create a new task
taskController.createTask = async (req, res, next) => {
  const info = req.body;
  const options = { new: true };
  try {
    //always remember to control your inputs
    if (!info || Object.keys(info).length === 0)
      throw new AppError(400, "Bad Request", "Create task error");

    const newTask = await Task.create(info);
    if (info.assignee) {
      const assignee = await User.findById(info.assignee);
      assignee.tasks.push(newTask._id);
      await assignee.save();
    }

    await newTask.save();
    await sendResponse(
      res,
      200,
      true,
      { task: newTask },
      null,
      "Create Task Successfully"
    );
  } catch (err) {
    next(err);
  }
};

//Get all tasks
taskController.getTasks = async (req, res, next) => {
  const { status, createdAt, updatedAt } = req.query;
  let filter = { isDeleted: false };
  if (status) filter.status = status;
  if (createdAt) filter.createdAt = createdAt;
  if (updatedAt) filter.updatedAt = updatedAt;
  try {
    //mongoose query
    const tasks = await Task.find(filter).populate("assignee");
    //Express validator
    if (!tasks) throw new AppError(400, "Bad Request", "No task found");

    sendResponse(res, 200, true, tasks, null, "Get Task List Successfully!");
  } catch (err) {
    next(err);
  }
};

//Get task by id
taskController.getTaskById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const targetTask = await Task.findById(id).populate("assignee");
    //Express validator
    if (!targetTask) throw new AppError(400, "Bad Request", "No task found");
    if (!ObjectId.isValid(id))
      throw new AppError(400, "Bad Request", "Not a valid object id");

    sendResponse(res, 200, true, targetTask, null, "Task Found");
  } catch (err) {
    next(err);
  }
};

//Search all tasks of 1 member by name or id
taskController.searchTasksByUser = async (req, res, next) => {
  let { userName, userId } = req.query;
  userId = mongoose.Types.ObjectId(userId);

  try {
    let user = null;
    if (userName) {
      user = await User.findOne({ name: userName });
    } else {
      user = await User.findById(userId);
    }
    //Express validator
    if (!user) throw new AppError(400, "Bad Request", "No user found");

    const userTasks = user.tasks;

    sendResponse(
      res,
      200,
      true,
      userTasks,
      null,
      `Get all tasks of user successfully`
    );
  } catch (err) {
    next(err);
  }
};

//Assign a task to a user by their id
taskController.assignTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { userId } = req.body;
  const options = { new: true };
  try {
    //Mongoose Query
    let targetTask = await Task.findById(taskId);
    //Express validator
    if (!targetTask) throw new AppError(400, "Bad Request", "No task found");
    const assignedUser = await User.findById(userId);
    if (!assignedUser)
      throw new AppError(400, "Bad Request", "No user with that name found");

    targetTask.assignee = assignedUser._id;
    assignedUser.tasks.push(taskId);

    await targetTask.save();
    await assignedUser.save();

    sendResponse(
      res,
      200,
      true,
      targetTask,
      null,
      "Assign task to user successfully"
    );
  } catch (err) {
    next(err);
  }
};

//Unassign a task to a user by their id
taskController.unassignTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { userId } = req.body;
  const options = { new: true };
  try {
    //Mongoose Query
    let targetTask = await Task.findById(taskId);
    //Express validator
    if (!targetTask) throw new AppError(400, "Bad Request", "No task found");
    const unassignedUser = await User.findById(userId);
    if (!unassignedUser)
      throw new AppError(400, "Bad Request", "No user with that name found");

    targetTask.assignee = null;
    const index = unassignedUser.tasks.indexOf(taskId);
    if (index > -1) unassignedUser.tasks.splice(index, 1);

    await targetTask.save();
    await unassignedUser.save();

    sendResponse(
      res,
      200,
      true,
      targetTask,
      null,
      "Remove task from user successfully"
    );
  } catch (err) {
    next(err);
  }
};

//Update a task's status
taskController.updateTaskStatus = async (req, res, next) => {
  const { taskId } = req.params;
  const { newStatus } = req.body;

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    let task = await Task.findById(taskId);
    //Express validator
    if (!task) throw new AppError(400, "Bad Request", "No task found");
    if (!ObjectId.isValid(taskId))
      throw new AppError(400, "Bad Request", "Not a valid object id");

    if (task.status !== "done") {
      task.status = newStatus;
    } else {
      if (newStatus === "archive") {
        task.status = newStatus;
      } else {
        throw new AppError(
          400,
          "Bad Request",
          "Can only change status to 'archive'"
        );
      }
    }

    await task.save();
    sendResponse(
      res,
      200,
      true,
      task,
      null,
      "Update Task Status Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

//Soft delete a task
taskController.deleteTask = async (req, res, next) => {
  const { taskId } = req.params;

  const options = { new: true };
  try {
    //mongoose query
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      options
    );
    //Express validator
    if (!updatedTask) throw new AppError(400, "Bad Request", "No task found");
    if (!ObjectId.isValid(taskId))
      throw new AppError(400, "Bad Request", "Not a valid object id");

    sendResponse(
      res,
      200,
      true,
      updatedTask,
      null,
      "Delete Task Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
