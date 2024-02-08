const Joi = require('joi');

const limit = Joi.number();
const offset = Joi.number();
const orderBy = Joi.string();

const queryParametersSchema = Joi.object({
  limit,
  offset,
  orderBy: orderBy.valid('ASC', 'DESC'),
});

module.exports = {
  queryParametersSchema,
}