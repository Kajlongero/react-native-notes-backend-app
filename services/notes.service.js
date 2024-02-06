const { connection: prisma } = require('../connections/prisma.connection');
const { decodeToken } = require('../functions/jwt.functions');
const verifyExistence = require('../functions/verify.existence');

class NoteService {

  async findAll (token, skip, take) {
    const data = await prisma.notes.findMany({
      skip: skip ?? 0,
      take: take ?? 30,
    });

    return data;
  }

  async findNotesByUser(user, skip, take) {
    const userExist = await verifyExistence('users', user.uid, prisma);
      if(!userExist) throw new Error('unauthorized'); 
    
    const data = await prisma.notes.findMany({
      where: {
        userId: user.uid,
      },
      skip: skip ?? 0,
      take: take ?? 0,
    });

    return data;
  }

  async findUnique (id, user) {
    const noteExist = await verifyExistence('notes', id, prisma);

    if(!noteExist) throw new Error('note does not exist');

    if(noteExist.userId !== user.uid && user.role !== 'ADMIN') 
      throw new Error('unauthorized');

    return data;
  }

  async create (user, data) {
    const userExist = await verifyExistence('users', user.uid, prisma);

    if(!userExist)
      throw new Error('unauthorized');

    const note = await prisma.notes.create({
      data: {
        ...data,
        categoryId: data.categoryId ?? 1,
        userId: user.uid,
      },
    });

    return note;
  }

  async update (id, user, dataUpd) {

    const [notesExist, userExist] = await Promise.all([
      prisma.notes.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if(!userExist) throw new Error('user does not exists')
    if(!notesExist) throw new Error('note does not exists')

    if(userExist.authId !== user.sub) throw new Error('unauthorized');

    const update = await prisma.notes.update({
      where: {
        id
      },
      data: dataUpd
    });

    return update;
  }

  async destroy (id, user) {
    const [notesExist, userExist] = await Promise.all([
      prisma.notes.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if(!userExist) throw new Error('user does not exists')
    if(!notesExist) throw new Error('note does not exists')

    if(userExist.authId !== user.sub && user.role !== 'ADMIN') 
      throw new Error('unauthorized');

    const deleted = await prisma.notes.delete({
      where: {
        id
      },
    });

    return "deleted successfully";
  }
};

module.exports = NoteService;