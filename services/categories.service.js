const { connection: prisma } = require("../connections/prisma.connection");
const { notFound, unauthorized, forbidden } = require("@hapi/boom");
const verifyExistence = require("../functions/verify.existence");

class CategoryService {
  async categoriesByUser(user, skip = 0, take = 30) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    if (!userExist) throw unauthorized();

    const categories = await prisma.categories.findMany({
      where: {
        userId: user.uid,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        createdAt: "asc",
      },
    });

    return categories;
  }

  async getAll(skip, take) {
    const categories = await prisma.categories.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return categories;
  }

  async getUniqueCategory(id, user) {
    const [categoryExist, userExist] = await Promise.all([
      prisma.categories.findUnique({ where: { id }, include: { notes: true } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if (!userExist) throw notFound("user does not exists");
    if (!categoryExist) throw notFound("category does not exists");

    if (userExist.authId !== user.sub) throw forbidden("unauthorized");

    if (categoryExist.userId !== userExist.id) throw forbidden("unauthorized");

    return categoryExist;
  }

  async createCategory(user, dataToCreate) {
    const findUser = await verifyExistence("users", user.uid, prisma);
    if (!findUser) throw unauthorized("log in again");

    const created = await prisma.categories.create({
      data: {
        ...dataToCreate,
        userId: user.uid,
      },
    });

    return created;
  }

  async editCategory(id, user, dataToModify) {
    const userExist = await verifyExistence("users", user.uid, prisma);

    if (!userExist) throw notFound("user does not exists");

    const category = await this.getUniqueCategory(id, user);
    if (!category) throw notFound("category does not exists");

    if (userExist.authId !== user.sub && user.role1 !== "ADMIN")
      throw unauthorized("unauthorized");

    const modify = await prisma.categories.update({
      where: {
        id,
      },
      data: {
        ...dataToModify,
      },
    });

    return modify;
  }

  async deleteCategory(id, user) {
    const category = await verifyExistence("categories", id, prisma);

    if (!category) throw Error("category does not exists");
    if (category.userId !== user.uid) throw Error("unauthorized");

    const deleted = Promise.all([
      prisma.categories.delete({ where: { id } }),
      prisma.notes.deleteMany({ where: { categoryId: id } }),
    ]);

    return id;
  }
}

module.exports = CategoryService;
