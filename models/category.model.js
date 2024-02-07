const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().max(120);
const userId = Joi.string().uuid();

const getCategorySchema = Joi.object({
  id: id.required(),
});

const createCategorySchema = Joi.object({
  name: name.required(),
});

module.exports = {
  getCategorySchema,
  createCategorySchema,
}