const express = require('express');
const passport = require('passport');
const router = express.Router();
const { validateSchema } = require('../middlewares/joi.validator');
const CategoryService = require('../services/categories.service');
const successResponse = require('../responses/success.response');
const { queryParametersSchema } = require('../models/query.model');
const { getCategorySchema, createCategorySchema } = require('../models/category.model');
const service = new CategoryService();

router.get(
  '/all-categories', 
  validateSchema(queryParametersSchema, 'query'),
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try{
      const { limit, offset } = req.query;
      const user = req.user;
      const categories = await service.categoriesByUser(user, offset, limit);

      successResponse(res, categories, 'OK', 200);
    }catch(e){
      next(e);
    }
  }
);

router.get(
  '/:id',
  validateSchema(getCategorySchema, 'params'),
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const user = req.user;
      const category = await service.getUniqueCategory(id, user);

      successResponse(res, category, 'OK', 200);
    }catch(e){
      next(e);
    }
  }
);

router.post(
  '/create-category',
  validateSchema(createCategorySchema, 'body'),
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try{
      const body = req.body;
      const user = req.user;
      const category = await service.createCategory(user, body);

      successResponse(res, category, 'category created successfully', 201);
    }catch(e){
      next(e);
    }
  }
);

router.patch(
  '/update-category/:id',
  validateSchema(getCategorySchema, 'params'),
  validateSchema(createCategorySchema, 'body'),
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try{
      const { id } = req.params;
      const body = req.body;
      const user = req.user;
      const category = await service.editCategory(id, user, body);

      successResponse(res, category, 'category updated successfully', 201);
    }catch(e){

    }
  }
);

router.delete(
  '/delete-category/:id',
  validateSchema(getCategorySchema, 'params'),
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try{
      const user = req.user;
      const { id } = req.params;
      const category = await service.deleteCategory(id, user);

      successResponse(res, category, 'deleted successfully', 201);
    }catch(e){
      next(e);
    }
  }
)

module.exports = router;