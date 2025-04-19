const router = require('express').Router();

const homeRoutes = require("./HomeController");
const projectRoutes = require('./ProjectController');
const taskRoutes = require('./TaskController');
const plantRoutes = require('./PlantController');

router.use('/', homeRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use('/plants', plantRoutes);

module.exports = router;

