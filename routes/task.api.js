const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  searchTasksByUserName,
  assignTask,
  searchTasksByUserId,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/task.controller.js");

/**
 * @route GET API/tasks
 * @description Get a list of tasks
 * @access private
 */
router.get("/", getTasks);

/**
 * @route POST api/tasks
 * @description Create new task
 * @access private, assigner
 */
router.post("/", createTask);

/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access private
 */
router.get("/:id", getTaskById);

/**
 * @route GET api/tasks/:targetName
 * @description Get tasks by user's name
 * @access private
 */
router.get("/user/:targetName", searchTasksByUserName);

/**
 * @route GET api/tasks/:userId
 * @description Get tasks by user's id
 * @access private
 */
router.get("/user/:userId", searchTasksByUserId);

/**
 * @route PUT api/tasks/:taskId
 * @description Assign or unassign task to a employee
 * @access private
 */
router.put("/:taskId", assignTask);

/**
 * @route PUT api/tasks/status/:taskId
 * @description Update task's status
 * @access private
 */
router.put("/status/:taskId", updateTaskStatus);

/**
 * @route PUT api/tasks/task/:taskId
 * @description Soft delete a task
 * @access private
 */
router.put("/task/:taskId", deleteTask);

//export
module.exports = router;
