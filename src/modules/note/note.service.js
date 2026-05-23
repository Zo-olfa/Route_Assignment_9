import NoteModel from "./../../db/models/note.model.js";

// 1. Create a Single Note (Get the id for the logged-in user (userId) from the token not the body) (send the token in the headers) (0.5 Grade)
export const createSingleNoteByUserService = async (request, response) => {
  try {
    const { user, body: note } = request;

    Object.assign(note, { userId: user.id });
    const createdNote = await NoteModel.create(note);

    return response.status(200).json({
      status: "success",
      message: "Note Created Successfully!!",
      data: createdNote.toBaseNote(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 2. Update a single Note by its id and return the updated note. (Only the owner of the note can make this operation) (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const updateSingleNoteByIDService = async (request, response) => {
  try {
    const {
      user,
      params: { noteId },
      body: { title, content },
    } = request;

    const foundNote = await NoteModel.findById(noteId);
    if (!foundNote) {
      return response.status(404).json({
        status: "error",
        message: "Note Not Found!!",
      });
    }

    if (foundNote.userId.toHexString() !== user.id) {
      return response.status(403).json({
        status: "error",
        message: "You are not authorized!!",
      });
    }

    const updatedNote = await NoteModel.findOneAndUpdate(
      { _id: noteId },
      { $set: { title, content } },
      { returnDocument: "after" },
    );

    return response.status(200).json({
      status: "success",
      message: "Note Updated Successfully!!",
      data: updatedNote.toBaseNote(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 3. Replace the entire note document with the new data provided in the request body. (Only the owner of the note can make this operation) (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const replaceSingleNoteByIDService = async (request, response) => {
  try {
    const {
      user,
      params: { noteId },
      body: note,
    } = request;

    const foundNote = await NoteModel.findById(noteId);
    if (!foundNote) {
      return response.status(404).json({
        status: "error",
        message: "Note Not Found!!",
      });
    }

    if (foundNote.userId.toHexString() !== user.id) {
      return response.status(403).json({
        status: "error",
        message: "You are not authorized!!",
      });
    }

    const replacedNote = await NoteModel.findOneAndReplace({ _id: noteId }, note, {
      returnDocument: "after",
    });

    return response.status(200).json({
      status: "success",
      message: "Note Replaced Successfully!!",
      data: replacedNote.toBaseNote(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 4. Updates the title of all notes created by a logged-in user.) (Get the new Title from the body) (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const updateAllNotesByTitleService = async (request, response) => {
  try {
    const {
      user,
      body: { title },
    } = request;

    const updatedNotes = await NoteModel.updateMany({ userId: user.id }, { $set: { title } });
    if (updatedNotes.modifiedCount === 0) {
      return response.status(404).json({
        status: "error",
        message: "No Notes Found To Update!!",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "All Notes Updated Successfully!!",
      data: updatedNotes,
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 5. Delete a single Note by its id and return the deleted note. (Only the owner of the note can make this operation) (Get the id for the logged-in user from the token not the body) (0.5 Grade)
export const deleteSingleNoteByIDService = async (request, response) => {
  try {
    const {
      user,
      params: { noteId },
    } = request;

    const foundNote = await NoteModel.findById(noteId);
    if (!foundNote) {
      return response.status(404).json({
        status: "error",
        message: "Note Not Found!!",
      });
    }

    if (foundNote.userId.toHexString() !== user.id) {
      return response.status(403).json({
        status: "error",
        message: "You are not authorized!!",
      });
    }

    const deletedNote = await NoteModel.findOneAndDelete(
      { _id: noteId },
      { returnDocument: "after" },
    );

    return response.status(200).json({
      status: "success",
      message: "Note Deleted Successfully!!",
      data: deletedNote.toBaseNote(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 6. Retrieve a paginated list of notes for the logged-in user, sorted by “createdAt” in descending order. (Get page and limit from query parameters) (Get the id for the logged-in user (userId) from the token not the body) (send the token in the headers) (0.5 Grade)
export const getPaginatedNotesByUserService = async (request, response) => {
  try {
    const {
      user,
      query: { page, limit },
    } = request;

    // calculate meta data
    const perPage = Math.min(Number(limit) || 15, 15);
    const currentPage = Number(page) || 1;
    const offset = perPage * (currentPage - 1);

    const notesList = await NoteModel.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(perPage);

    if (notesList.length === 0) {
      return response.status(404).json({
        status: "error",
        message: "No Notes Found To Get!!",
      });
    }

    const totalNotesCount = await NoteModel.countDocuments({ userId: user.id });

    return response.status(200).json({
      status: "success",
      message: "Notes Sorted and Paginated Successfully!!",
      data: notesList.map((note) => note.toBaseNote()),
      meta: {
        from: notesList.length ? offset + 1 : 0,
        to: notesList.length ? offset + notesList.length : 0,
        perPage,
        currentPage,
        lastPage: Math.ceil(totalNotesCount / perPage),
        currentCount: notesList.length,
        totalCount: totalNotesCount,
      },
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 7. Get a note by its id. (Only the owner of the note can make this operation) (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const getSingleNoteByIDService = async (request, response) => {
  try {
    const {
      user,
      params: { id: noteId },
    } = request;

    const foundNote = await NoteModel.findById(noteId);
    if (!foundNote) {
      return response.status(404).json({
        status: "error",
        message: "Note Not Found!!",
      });
    }

    if (foundNote.userId.toHexString() !== user.id) {
      return response.status(403).json({
        status: "error",
        message: "You are not authorized!!",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "Note Fetched Successfully!!",
      data: foundNote.toBaseNote(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 8. Get a note for logged-in user by its content. (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const getSingleNoteByContentService = async (request, response) => {
  try {
    const {
      user,
      query: { content },
    } = request;

    const foundNote = await NoteModel.findOne({ userId: user.id, content });
    if (!foundNote) {
      return response.status(404).json({
        status: "error",
        message: "Note Not Found!!",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "Note Fetched Successfully!!",
      data: foundNote.toBaseNote(),
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 9. Retrieves all notes for the logged-in user with user information, selecting only the “title, userId and createdAt” from the note and the “email” from the user. (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const getAllNotesWithUserService = async (request, response) => {
  try {
    const { user } = request;

    const notesList = await NoteModel.find({ userId: user.id })
      .select("title userId createdAt")
      .populate("userId", "email -_id")
      .lean({ virtuals: false })
      .exec();

    if (notesList.length === 0) {
      return response.status(404).json({
        status: "error",
        message: "No Notes Found To Get!!",
      });
    }
    return response.status(200).json({
      status: "success",
      message: "Notes With User Fetched Successfully!!",
      data: notesList,
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 10. Using aggregation, retrieves all notes for the logged-in user with user information (name and email) and allow searching notes by the title. (1 Grade)
export const getAllNotesByUserWithAggregateService = async (request, response) => {
  try {
    const {
      user,
      query: { title },
    } = request;

    const notesList = await NoteModel.aggregate([
      {
        $match: {
          userId: user._id,
          title: { $regex: title, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user" } },
      {
        $project: {
          _id: 0,
          title: 1,
          userId: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            email: "$user.email",
          },
        },
      },
    ]);

    return response.status(200).json({
      status: "success",
      message: "Notes With Aggregate Fetched Successfully!!",
      data: notesList,
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};

// 11. Delete all notes for the logged-in user. (Get the id for the logged-in user (userId) from the token not the body) (0.5 Grade)
export const deleteAllNotesByUserService = async (request, response) => {
  try {
    const { user } = request;

    const deletedNotes = await NoteModel.deleteMany({ userId: user.id });
    if (deletedNotes.deletedCount === 0) {
      return response.status(404).json({
        status: "error",
        message: "No Notes Found To Delete!!",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "All Notes Deleted Successfully!!",
      data: deletedNotes,
    });
  } catch (error) {
    return response.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error!!",
      ...(error.length > 0 && { error }),
    });
  }
};
