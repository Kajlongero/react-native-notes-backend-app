const { connection: prisma } = require("../connections/prisma.connection");
const { internal, unauthorized } = require("@hapi/boom");
const verifyExistence = require("../functions/verify.existence");
const { notFound } = require("@hapi/boom");
const { badRequest } = require("@hapi/boom");
const { conflict } = require("@hapi/boom");

class NoteService {
  async findAll(token, skip, take) {
    const data = await prisma.notes.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
    });

    return data;
  }

  async findNotesByUser(user, skip, take) {
    const userExist = await verifyExistence("users", user.uid, prisma);

    if (!userExist) throw new unauthorized("unauthorized");

    const data = await prisma.notes.findMany({
      where: {
        userId: user.uid,
      },
      skip: parseInt(skip),
      take: parseInt(take),
    });

    return data;
  }

  async findNotesByCategory(user, id, skip = 0, take = 30) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    const categoryExist = await verifyExistence("categories", id, prisma);

    if (!userExist) throw new unauthorized("unauthorized");
    if (!categoryExist) throw new notFound("category does not exists");

    const data = await prisma.notes.findMany({
      where: {
        categoryId: id,
      },
      skip: parseInt(skip),
      take: parseInt(take),
    });

    return data;
  }

  async findUnique(id, user) {
    const noteExist = await verifyExistence("notes", id, prisma);

    if (!noteExist) throw new unauthorized("note does not exist");

    if (noteExist.userId !== user.uid) throw new unauthorized("unauthorized");

    return data;
  }

  async create(user, body) {
    const { title, description, categoryId, priorityId } = body;

    const [userExist, categoryExist, priorityExists] = await Promise.all([
      prisma.users.findUnique({
        where: { id: user.uid },
        select: { id: true },
      }),
      prisma.categories.findUnique({
        where: { id: categoryId },
        select: { id: true },
      }),
      prisma.priorities.findUnique({
        where: { id: priorityId },
        select: { id: true },
      }),
    ]);

    if (!userExist) throw new unauthorized("unauthorized");
    if (!categoryExist) throw new notFound("category not found");
    if (!priorityExists) throw new badRequest("invalid priority id");

    try {
      const note = await prisma.notes.create({
        data: {
          title: title,
          description: description,
          categoryId: categoryId,
          priorityId: parseInt(priorityId),
          userId: userExist.id,
          isFavorite: false,
        },
      });

      return note;
    } catch (e) {
      console.log(e);
      throw new internal(e.message);
    }
  }

  async update(id, user, dataUpd) {
    const [notesExist, userExist] = await Promise.all([
      prisma.notes.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if (!userExist) throw new unauthorized("user does not exists");
    if (!notesExist) throw new unauthorized("note does not exists");

    if (userExist.authId !== user.sub) throw new unauthorized("unauthorized");

    const update = await prisma.notes.update({
      where: {
        id,
      },
      data: dataUpd,
    });

    return update;
  }

  async destroy(id, user) {
    const [notesExist, userExist] = await Promise.all([
      prisma.notes.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if (!userExist) throw new unauthorized("user does not exists");
    if (!notesExist) throw new unauthorized("note does not exists");

    if (userExist.authId !== user.sub) throw unauthorized("unauthorized");

    const deleted = await prisma.notes.delete({
      where: {
        id,
      },
    });

    return id;
  }
}

module.exports = NoteService;
