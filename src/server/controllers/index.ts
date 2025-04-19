const router = require('express').Router();

const homeRoutes = require("./HomeController");
const plantRoutes = require('./PlantController');

router.use('/', homeRoutes);
router.use('/plants', plantRoutes);

module.exports = router;

