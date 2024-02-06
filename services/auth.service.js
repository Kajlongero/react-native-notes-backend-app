const { connection: prisma } = require('../connections/prisma.connection');
const { hash } = require('bcrypt');
const { decodeToken, generateToken } = require('../functions/jwt.functions');
const verifyExistence = require('../functions/verify.existence');
const { notFound } = require('@hapi/boom');

class AuthService {

  async getUserByToken (token) {
    const decoded = decodeToken(token);

    const user = await prisma.users.findUnique({
      where: {
        authId: decoded.sub,
      },
      select: {
        auth: {
          select: {
            id: true,        
            email: true,
          }
        },
        profile: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    return user;
  }

  async getByEmail (email) {
    const getUserByEmail = await prisma.users.findUnique({
      where: {
        auth: {
          email: email,
        }
      },
      include: {
        auth: true,
      }
    });
    if(!getUserByEmail) 
      throw new notFound('invalid credentials');

    return getUserByEmail;
  }

  async getUnique (id) {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        auth: {
          select: {
            email: true,
          }
        },
        createdAt: true,
      }
    });

    return user;
  }

  async createUser(data) {
    const hashPassword = await hash(data, 10);

    const authData = {
      email: data.email,
      password: hashPassword,
    };

    const transaction = await prisma.$transaction(async (tx) => {
      const auth = await tx.auth.create({
        data: authData,
        select: {
          id: true,
        }
      });

      const user = await tx.auth.create({
        data: {
          authId: auth.id,
        },
        include: {
          auth: true,
        },
      });

      return user;
    })

    const token = generateToken({
      sub: transaction.auth.id,
      uid: transaction.id,
    });

    return token;
  }

  async editUser(user, data) {
    const editAuth = await prisma.auth.update({
      where: {
        id: user.sub,
      },
      data: {
        email: data.email ? data.email : undefined,
      }
    });

    delete data.email;

    const editUser = await prisma.users.update({
      where: {
        id: user.uid,
      },
      data: {
        ...data,
      }
    });

    return "Updated Successfully";
  }

  async deleteUser(user) {
    const userExists = await verifyExistence('users', user.uid, prisma);

    if(!userExists) throw new Error('user does not exists');

    await Promise.all([
      prisma.users.delete({ where: { id: user.uid } }),
      prisma.auth.delete({ where: { id: user.sub } }),
      prisma.categories.deleteMany({ where: { userId: user.uid } }),
      prisma.notes.deleteMany({ where: { userId: user.uid } }),
    ]);

    return id;
  }

}

module.exports = AuthService;