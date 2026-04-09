const express = require("express");
const { getAllCategories, createCategory } = require("../controllers/categoryController");

const router = express.Router();

// GET all categories
router.get("/", getAllCategories);

// POST new category (optional)
router.post("/", createCategory);

module.exports = router;