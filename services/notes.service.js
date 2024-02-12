const { connection: prisma } = require("../connections/prisma.connection");
const { internal, unauthorized } = require("@hapi/boom");
const { notFound } = require("@hapi/boom");
const { badRequest } = require("@hapi/boom");
const verifyExistence = require("../functions/verify.existence");

class NoteService {
  async getFavorites(user, take = 30, skip = 0) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    if (!userExist) throw unauthorized("unauthorized");

    const notes = await prisma.notes.findMany({
      where: {
        userId: user.uid,
        AND: {
          isFavorite: true,
        },
      },
      skip: parseInt(skip),
      take: parseInt(take),
    });

    return notes;
  }

  async findNotesByUser(user, skip = 0, take = 30) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    if (!userExist) throw unauthorized("unauthorized");

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
    const [userExist, categoryExist] = await Promise.all([
      verifyExistence("users", user.uid, prisma),
      verifyExistence("categories", id, prisma),
    ]);

    if (!userExist) throw unauthorized("unauthorized");
    if (!categoryExist) throw notFound("category does not exists");

    const data = await prisma.notes.findMany({
      where: {
        categoryId: id,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        priorityId: "desc",
      },
    });

    return data;
  }

  async findUnique(id, user) {
    const noteExist = await verifyExistence("notes", id, prisma);

    if (!noteExist) throw unauthorized("note does not exist");
    if (noteExist.userId !== user.uid) throw unauthorized("unauthorized");

    return noteExist;
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

    if (!userExist) throw unauthorized("unauthorized");
    if (!categoryExist) throw notFound("category not found");
    if (!priorityExists) throw badRequest("invalid priority id");

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
      throw internal(e.message);
    }
  }

  async update(id, user, dataUpd) {
    const [notesExist, userExist] = await Promise.all([
      prisma.notes.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if (!userExist) throw unauthorized("user does not exists");
    if (!notesExist) throw unauthorized("note does not exists");

    if (userExist.authId !== user.sub) throw unauthorized("unauthorized");

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

    if (!userExist) throw unauthorized("user does not exists");
    if (!notesExist) throw unauthorized("note does not exists");

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
