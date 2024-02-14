const { connection: prisma } = require("../connections/prisma.connection");
const { internal, unauthorized } = require("@hapi/boom");
const { notFound } = require("@hapi/boom");
const { badRequest } = require("@hapi/boom");
const verifyExistence = require("../functions/verify.existence");

class NoteService {
  async getFavorites(user, take = 30, skip = 0) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    if (!userExist) throw new unauthorized("unauthorized");

    const query = {
      where: {
        userId: user.uid,
        AND: {
          isFavorite: true,
        },
      },
      skip: parseInt(skip),
      take: parseInt(take),
    };

    const [notes, count] = await prisma.$transaction([
      prisma.notes.findMany(query),
      prisma.notes.count({ where: query.where }),
    ]);

    return {
      data: notes,
      pagination: {
        count: count,
        left: count - parseInt(skip) <= 0 ? 0 : count - parseInt(skip),
      },
    };
  }

  async findNotesByUser(user, skip = 0, take = 30) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    if (!userExist) throw new unauthorized("unauthorized");

    const query = {
      where: {
        userId: user.uid,
      },
      skip: parseInt(skip),
      take: parseInt(take),
    };

    const [notes, count] = await prisma.$transaction([
      prisma.notes.findMany(query),
      prisma.notes.count({ where: query.where }),
    ]);

    return {
      data: notes,
      pagination: {
        count: count,
        left: count - parseInt(skip) <= 0 ? 0 : count - parseInt(skip),
      },
    };
  }

  async findNotesByCategory(user, id, skip = 0, take = 30) {
    const [userExist, categoryExist] = await prisma.$transaction([
      prisma.users.findUnique({ where: { id: user.uid } }),
      prisma.categories.findUnique({ where: { id } }),
    ]);

    if (!userExist) throw new unauthorized("unauthorized");
    if (!categoryExist) throw new notFound("category does not exists");

    const query = {
      where: {
        categoryId: id,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        priorityId: "desc",
      },
    };

    const [notes, count] = await prisma.$transaction([
      prisma.notes.findMany(query),
      prisma.notes.count({ where: query.where }),
    ]);

    return {
      data: notes,
      pagination: {
        total: count,
        left: count - parseInt(skip) <= 0 ? 0 : count - parseInt(skip),
      },
    };
  }

  async findUnique(id, user) {
    const noteExist = await verifyExistence("notes", id, prisma);

    if (!noteExist) throw new unauthorized("note does not exist");
    if (noteExist.userId !== user.uid) throw new unauthorized("unauthorized");

    return noteExist;
  }

  async create(user, body) {
    const { title, description, categoryId, priorityId } = body;

    const [userExist, categoryExist, priorityExists] =
      await prisma.$transaction([
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
      throw new internal(e.message);
    }
  }

  async update(id, user, dataUpd) {
    const [notesExist, userExist] = await prisma.$transaction([
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
    const [notesExist, userExist] = await prisma.$transaction([
      prisma.notes.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if (!userExist) throw new unauthorized("user does not exists");
    if (!notesExist) throw new unauthorized("note does not exists");

    if (userExist.authId !== user.sub) throw new unauthorized("unauthorized");

    const deleted = await prisma.notes.delete({
      where: {
        id,
      },
    });

    return id;
  }
}

module.exports = NoteService;
