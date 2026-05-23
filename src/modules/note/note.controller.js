import { Router } from "express";
import * as noteService from "./note.service.js";

const router = Router();

router.get("/welcome", (_, response) =>
  response.status(200).json({ status: "success", message: "Welcome to Notes API!" }),
);

// • URL: POST / notes
router.post("/", noteService.createSingleNoteByUserService);

// • URL: PATCH /notes/all
router.patch("/all", noteService.updateAllNotesByTitleService);

// • URL: PATCH /notes/:noteId => /notes/64d91c42d8979e1f30a12346
router.patch("/:noteId", noteService.updateSingleNoteByIDService);

// • URL: PUT /notes/replace/:noteId=> /notes/replace/64d91c42d8979e1f30a12348
router.put("/replace/:noteId", noteService.replaceSingleNoteByIDService);

// • URL: DELETE /notes/:noteId => /notes/64d91c42d8979e1f30a12346
router.delete("/:noteId", noteService.deleteSingleNoteByIDService);

// • URL: DELETE /notes
router.delete("/", noteService.deleteAllNotesByUserService);

// • URL: GET /notes/paginate-sort => for example /notes/paginate-sort?page=2&limit=3
router.get("/paginate-sort", noteService.getPaginatedNotesByUserService);

// • URL: GET /notes/note-by-content => / notes/note-by-content?content=Workout Plan
router.get("/note-by-content", noteService.getSingleNoteByContentService);

// • URL: GET /notes/note-with-user
router.get("/note-with-user", noteService.getAllNotesWithUserService);

// • URL: GET /notes/aggregate => /notes/aggregate
router.get("/aggregate", noteService.getAllNotesByUserWithAggregateService);

// • URL: GET /notes/:id => /posts/64a3baf1e567890124
router.get("/:id", noteService.getSingleNoteByIDService);

export default router;
