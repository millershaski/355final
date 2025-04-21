const router = require('express').Router();

const homeRoutes = require("./HomeController");
const projectRoutes = require("./ProjectController");
const taskRoutes = require("./TaskController");
const userRoutes = require("./UserController");


router.use('/', homeRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use("/user", userRoutes);


module.exports = router;

