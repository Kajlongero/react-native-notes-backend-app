const { connection: prisma } = require("../connections/prisma.connection");
const { hash } = require("bcrypt");
const { generateToken } = require("../functions/jwt.functions");
const { notFound, conflict } = require("@hapi/boom");
const { unauthorized } = require("@hapi/boom");
const verifyExistence = require("../functions/verify.existence");
const { forbidden } = require("joi");

class AuthService {
  async getUserByToken(user) {
    const users = await prisma.users.findUnique({
      where: {
        id: user.uid,
        AND: {
          authId: user.sub,
        },
      },
      select: {
        auth: {
          select: {
            id: true,
            email: true,
          },
        },
        username: true,
        createdAt: true,
      },
    });
    if (!users) throw new notFound("invalid token");

    return users;
  }

  async getByEmail(email) {
    const getUserByEmail = await prisma.auth.findUnique({
      where: {
        email: email,
      },
    });
    if (!getUserByEmail) throw new notFound("invalid credentials");

    const user = await prisma.users.findUnique({
      where: {
        authId: getUserByEmail.id,
      },
      include: {
        auth: true,
      },
    });

    return user;
  }

  async getUnique(id) {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        auth: {
          select: {
            email: true,
          },
        },
        createdAt: true,
      },
    });

    return user;
  }

  async createUser(data) {
    const hashPassword = await hash(data.password, 10);

    const authData = {
      email: data.email,
      password: hashPassword,
    };

    const emailExists = await prisma.auth.findUnique({
      where: {
        email: data.email,
      },
      select: {
        email: true,
      },
    });
    if (emailExists) throw new conflict("email already used");

    const usernameTaken = await prisma.users.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
      },
    });
    if (usernameTaken) throw new conflict("username already taken");

    const user = await prisma.$transaction(async (tx) => {
      const auth = await tx.auth.create({
        data: {
          ...authData,
          userRole: "USER",
        },
        select: {
          id: true,
        },
      });

      const userCreated = await tx.users.create({
        data: {
          username: data.username,
          authId: auth.id,
        },
      });

      const userName = `${userCreated.username
        .charAt(0)
        .toUpperCase()}${userCreated.username.substring(
        1,
        userCreated.username.length
      )}`;

      await tx.categories.create({
        data: {
          name: `${userName} defaults category`,
          userId: userCreated.id,
        },
      });

      return userCreated;
    });

    const token = generateToken({
      sub: user.authId,
      uid: user.id,
    });
    return {
      token: token,
    };
  }

  async editUser(user, data) {
    const { username } = data;

    const userData = await prisma.users.findUnique({
      where: {
        id: user.uid,
      },
    });

    if (!userData) throw new forbidden("you can not perform this action");

    const updated = await prisma.users.update({
      where: {
        id: user.uid,
      },
      data: {
        username: username,
      },
    });

    return updated;
  }

  async deleteUser(user) {
    const userExists = await verifyExistence("auth", user.sub, prisma);
    if (!userExists) throw new unauthorized("user does not exists");

    await prisma.$transaction([
      prisma.notes.deleteMany({ where: { userId: user.uid } }),
      prisma.categories.deleteMany({ where: { userId: user.uid } }),
      prisma.users.delete({ where: { authId: userExists.id } }),
      prisma.auth.delete({ where: { id: userExists.id } }),
    ]);

    return user.uid;
  }
}

module.exports = AuthService;
