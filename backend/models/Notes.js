import mongoose, { models } from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    recquired: true,
    type: String,
  },

  tag:{
    type: String,
    default: "General"
  },

  Date: {
    type: Date,
    default: Date.now
  }
});

models.export = mongoose.model("notes", NotesSchema);