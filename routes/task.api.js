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
  unassignTask,
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
 * @description Get tasks by user's name or id in query (userName, userId)
 * @access private
 */
router.get("/user", searchTasksByUser);

/**
 * @route PUT api/tasks/:taskId
 * @description Assign a task to a employee by their id (in body)
 * @access private
 */
router.put("/assign/:taskId", assignTask);

/**
 * @route PUT api/tasks/:taskId
 * @description Unassign a task to a employee by their id (in body)
 * @access private
 */
router.put("/unassign/:taskId", unassignTask);

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
router.delete("/:taskId", deleteTask);

//export
module.exports = router;
