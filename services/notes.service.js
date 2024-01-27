const { connection } = require('../connections/prisma.connection');
const { decodeToken } = require('../functions/jwt.functions');

class NoteService {

  async findAll (token, skip, take) {
    const token = decodeToken(token);

    const data = await connection.notes.findMany({
      where: {
        userId: token.uid,
      },
      skip: skip ?? 0,
      take: take ?? 30,
    });

    return data;
  }

  async findUnique (id, token) {
    const decoded = decodeToken(token);

    const data = await connection.notes.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
      }
    });

    if(decoded.uid !== data.userId)
      throw new Error('unauthorized');

    return data;
  }

  async create (token, data) {
    const decoded = decodeToken(token);
    
    const note = await connection.notes.create({
      data: {
        ...data,
        categoryId: data.categoryId ?? 1,
        userId: decoded.uid,
      },
    });

    return note;
  }

  async update (id, token, dataUpd) {
    const decoded = decodeToken(token);

    const data = await connection.notes.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      }
    });

    if(decoded.uid !== data.userId)
      throw new Error('unauthorized');

    const update = await connection.notes.update({
      where: {
        id
      },
      data: dataUpd
    });

    return update;
  }

  async destroy (id, token) {
    const decoded = decodeToken(token);

    const data = await connection.notes.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      }
    });


    if(decoded.uid !== data.userId)
      throw new Error('unauthorized');

    const deleted = await connection.notes.delete({
      where: {
        id
      },
    });
  }
};

module.exports = NoteService;