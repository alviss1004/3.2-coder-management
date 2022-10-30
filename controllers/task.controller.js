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
//Search all tasks of 1 member by name
taskController.searchTasksByUserName = async (req, res, next) => {
  const { targetName } = req.params;

  try {
    let user = await User.findOne({ name: targetName });
    //Express validator
    if (!user) throw new AppError(400, "Bad Request", "No user found");

    const userTasks = user.tasks;

    sendResponse(
      res,
      200,
      true,
      userTasks,
      null,
      `Get all tasks of ${targetName} successfully`
    );
  } catch (err) {
    next(err);
  }
};

//Search all tasks of 1 member by id
taskController.searchTasksByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    let user = await User.findById(userId);
    //Express validator
    if (!ObjectId.isValid(userId))
      throw new AppError(400, "Bad Request", "Not a valid object id");
    if (!user) throw new AppError(400, "Bad Request", "No user found");

    const userTasks = user.tasks;

    sendResponse(
      res,
      200,
      true,
      userTasks,
      null,
      `Get all tasks of user with id ${userId} successfully`
    );
  } catch (err) {
    next(err);
  }
};

//Assign or unassign a task to a user
taskController.assignTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { assigneeId } = req.body;
  const options = { new: true };
  try {
    let targetTask = await Task.findById(taskId);
    //Express validator
    if (!targetTask) throw new AppError(400, "Bad Request", "No task found");
    const assignedUser = await User.findById(assigneeId);
    if (!assignedUser)
      throw new AppError(400, "Bad Request", "No user with the provided id");
    if (!ObjectId.isValid(taskId) || !!ObjectId.isValid(assigneeId))
      throw new AppError(400, "Bad Request", "Not a valid object id");

    if (targetTask.assignee) {
      targetTask.assignee = null;
      const index = assignedUser.tasks.indexOf(taskId);
      if (index > -1) assignedUser.tasks.splice(index, 1);
    } else {
      targetTask.assignee = assigneeId;
      assignedUser.tasks.push(taskId);
    }

    await targetTask.save();
    await assignedUser.save();

    sendResponse(
      res,
      200,
      true,
      targetTask,
      null,
      "Update task's assignee successfully"
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
