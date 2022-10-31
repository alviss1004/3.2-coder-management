const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  assignTask,
  updateTaskStatus,
  deleteTask,
  searchTasksByUser,
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
router.get("/task/:id", getTaskById);

/**
 * @route GET api/tasks/user
 * @description Get tasks by user's name or id in query
 * @access private
 */
router.get("/user", searchTasksByUser);

/**
 * @route PUT api/tasks/:taskId
 * @description Assign or unassign task to a employee by their name (in body)
 * @access private
 */
router.put("/:taskId", assignTask);

/**
 * @route PUT api/tasks/status/:taskId
 * @description Update task's status by task id
 * @access private
 */
router.put("/status/:taskId", updateTaskStatus);

/**
 * @route PUT api/tasks/task/:taskId
 * @description Soft delete a task by id
 * @access private
 */
router.put("/task/:taskId", deleteTask);

//export
module.exports = router;
