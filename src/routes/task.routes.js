const express = require("express"); //express load krta hai 
const { getTasks, createTask, getTasksById, updateTask, deleteTask } = require("../controllers/task.controller");

const router = express.Router(); //related routes ko ek jagah rakhne ke liye router banata hai

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getTasksById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);


module.exports = router; //app.js ko import kar payega
