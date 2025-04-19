const router = require('express').Router();

const homeRoutes = require("./HomeController");
const projectRoutes = require('./ProjectController');
const plantRoutes = require('./PlantController');

router.use('/', homeRoutes);
router.use("/projects", projectRoutes);
router.use('/plants', plantRoutes);

module.exports = router;

