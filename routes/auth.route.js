const passport = require("passport");
const { Router } = require("express");
const { loginSchema, signupSchema } = require("../models/auth.model");
const { validateSchema } = require("../middlewares/joi.validator");
const successResponse = require("../responses/success.response");
const AuthService = require("../services/auth.service");
const instance = new AuthService();

const authRoute = Router();

authRoute.get(
  "/user-by-token",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;

      const exists = await instance.getUserByToken(user);
      successResponse(res, { user: { ...exists } }, "OK", 200);
    } catch (e) {
      next(e);
    }
  }
);

authRoute.post(
  "/login",
  validateSchema(loginSchema, "body"),
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const token = {
        token: req.user,
      };

      successResponse(res, token, "logged in successfully", 200);
    } catch (e) {
      next(e);
    }
  }
);

authRoute.post(
  "/signup",
  validateSchema(signupSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = await instance.createUser(body);

      successResponse(res, user, "signup successfully", 200);
    } catch (e) {
      next(e);
    }
  }
);

authRoute.delete(
  "/delete-profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const deleted = await instance.deleteUser(user);

      successResponse(res, { id: deleted }, "deleted successfully", 200);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = authRoute;
