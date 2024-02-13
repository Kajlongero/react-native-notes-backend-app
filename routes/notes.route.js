const passport = require("passport");
const express = require("express");
const router = express.Router();
const {
  getNotesSchema,
  createNoteSchema,
  updateNotesSchema,
  updatePrioritySchema,
} = require("../models/notes.model");
const { validateSchema } = require("../middlewares/joi.validator");
const NoteService = require("../services/notes.service");
const service = new NoteService();
const successResponse = require("../responses/success.response");
const { queryParametersSchema } = require("../models/query.model");

router.get(
  "/favorites",
  validateSchema(queryParametersSchema, "query"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const user = req.user;
      const data = await service.getFavorites(user, limit, offset);

      successResponse(res, [...data], "OK", 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/category/:id",
  validateSchema(getNotesSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { offset, limit } = req.query;
      const getNotes = await service.findNotesByCategory(
        req.user,
        id,
        offset ?? 0,
        limit ?? 30
      );

      successResponse(res, getNotes, "OK", 200);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/:id",
  validateSchema(getNotesSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const note = await service.findUnique(id, user);

      successResponse(res, note, "OK", 200);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/create-note",
  validateSchema(createNoteSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      const createNote = await service.create(user, body);

      successResponse(res, createNote, "created successfully", 201);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update-note/:id",
  validateSchema(getNotesSchema, "params"),
  validateSchema(updateNotesSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = req.user;

      const updated = await service.update(id, user, body);

      successResponse(res, updated, "updated successfully", 200);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update-note-priority/:id",
  validateSchema(getNotesSchema, "params"),
  validateSchema(updatePrioritySchema, "body"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = req.user;

      const updated = await service.update(id, user, body);

      successResponse(res, updated, "updated, successfully", 200);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/delete-note/:id",
  validateSchema(getNotesSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = req.user;

      const deleted = await service.destroy(id, user, body);

      successResponse(res, deleted, "deleted successfully", 201);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
