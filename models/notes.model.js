const Joi = require('joi');

const id = Joi.string()
const title = Joi.string().max(120);
const description = Joi.string().max(250);
const priority = Joi.number().min(1).max(5);
const categoryId = Joi.string().uuid();

const getNotesSchema = Joi.object({
  id: id.required(),
});

const createNoteSchema = Joi.object({
  title: title.required(),
  description: description.required(),
  categoryId: categoryId.required(),
  priorityId: priority.required(),
});

const updateNotesSchema = Joi.object({
  title,
  description,
  priorityId: priority,
});

const updatePrioritySchema = Joi.object({
  priority: priority.valid('LOW', 'MEDIUM', 'HIGH', 'VERY HIGH', 'IMPORTANT').required(),
});

module.exports = {
  getNotesSchema,
  createNoteSchema,
  updateNotesSchema,
  updatePrioritySchema,
}