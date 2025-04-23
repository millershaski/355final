const router = require('express').Router();

const homeRoutes = require("./HomeController");
const projectRoutes = require("./ProjectController");
const taskRoutes = require("./TaskController");
const userRoutes = require("./UserController");
const loginRoutes = require("./LoginController");
const registerRoutes = require("./RegisterController");
const logoutRoutes = require("./LogoutController");


router.use('', homeRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use("/user", userRoutes);

router.use("/login", loginRoutes);
router.use("/register", registerRoutes);
router.use("/logout", logoutRoutes);

module.exports = router;

