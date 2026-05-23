import mongoose, { Schema } from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    // • title (String, required)
    title: {
      type: String,
      required: [true, "Title property is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxLength: [100, "Title must be less than 100 characters long"],

      //1. Add a custom validator to the “title” field that ensure the title is not entirely uppercase. For example (“FIRST NOTE” ) (“First Note” ). (0.5 Grade)
      validate: {
        validator: function (value) {
          return !/^[A-Z\s]+$/.test(value);
        },
        message: "Title must not be entirely uppercase",
      },
    },
    // • content (String, required)
    content: {
      type: String,
      required: [true, "Content property is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters long"],
      maxLength: [5000, "Content must be less than 5000 characters long"],
    },
    // • userId (ref to Users, required)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "UserId property is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // • createdAt (Timestamp)
    // • updatedAt (Timestamp)
    timestamps: true,
    versionKey: false,
    methods: {
      toBaseNote: function () {
        return {
          id: this._id,
          title: this.title,
          content: this.content,
          userId: this.userId,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      },
    },
  },
);

const NoteModel = mongoose.model("Notes", NoteSchema);

export default NoteModel;
