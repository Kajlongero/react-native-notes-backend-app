const { connection } = require('../connections/prisma.connection');
const { compare, hash } = require('bcrypt');
const { decodeToken, generateToken } = require('../functions/jwt.functions');

class AuthService {

  async getUserByToken (token) {
    const decoded = decodeToken(token);

    const user = await connection.user.findUnique({
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

  async getUnique (id) {
    const user = await connection.user.findUnique({
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

    const transaction = await connection.$transaction(async (tx) => {
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

  async editUser(token, data) {
    const decoded = decodeToken(token);

    const editAuth = await connection.auth.update({
      where: {
        id: decoded.sub,
      },
      data: {
        email: data.email ? data.email : undefined,
      }
    });

    delete data.email;

    const editUser = await connection.users.update({
      where: {
        id: decoded.uid,
      },
      data: {
        ...data,
      }
    });

    return "Updated Successfully";
  }

  async deleteUser(token) {
    const decoded = decodeToken(token);

    const { id } = await connection.users.update({
      where: {
        id: decoded.uid
      },
      data: {
        deletedAt: new Date().toISOStrin(),
      },
    });

    return id;
  }

}

module.exports = AuthService;