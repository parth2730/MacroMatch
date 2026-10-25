const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    getFoods,
    getFoodById
} = require("../controllers/foodController");

const router = express.Router();


router.use(requireAuth);


router.get("/", getFoods);


router.get("/:id", getFoodById);

module.exports = router;