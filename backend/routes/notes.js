const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { query, body, validationResult } = require("express-validator");

// Router :: 1 Get All the Notes. Login required
router.get(
  "/getallthenotes",
  fetchuser,

  async (req, res) => {
    try {
      const notes = await Notes.find({ user: req.user.id });
      res.send(notes);
    } catch(errors) {
      console.log(errors);
      res.status(500).json({ error: "Internal Error Occured !!" });
    }
  }
);

// Router :: 2 Add a new Note. Login required
router.post(
  "/addnotes",
  fetchuser,

  //If length of name is not greater than 3
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be greater than 3"),

  //If email is not valid
  body("description").isLength({ min: 10 }).withMessage("Not Descriptive !!"),
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(401).send({ errors: errors });
      }

      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNotes = await notes.save();
      res.send(savedNotes);
    } catch(errors) {
      console.log(errors);
      res.status(500).json({ error: "Internal Error Occured !!" });
    }
  }
);

module.exports = router;
