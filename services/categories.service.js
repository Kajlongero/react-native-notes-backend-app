const { connection: prisma } = require("../connections/prisma.connection");
const { notFound, unauthorized, forbidden } = require("@hapi/boom");
const verifyExistence = require("../functions/verify.existence");

class CategoryService {
  async categoriesByUser(user, skip = 0, take = 30) {
    const userExist = await verifyExistence("users", user.uid, prisma);
    if (!userExist) throw new unauthorized();

    const query = {
      where: {
        userId: user.uid,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        createdAt: "asc",
      },
    };

    const [categories, count] = await prisma.$transaction([
      prisma.categories.findMany(query),
      prisma.categories.count({ where: query.where }),
    ]);

    return {
      data: categories,
      pagination: {
        total: count,
        left:
          skip === 0
            ? 0
            : count - parseInt(skip) <= 0
            ? 0
            : count - parseInt(skip),
      },
    };
  }

  async getAll(skip, take) {
    const categories = await prisma.categories.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return categories;
  }

  async getUniqueCategory(id, user) {
    const [categoryExist, userExist] = await prisma.$transaction([
      prisma.categories.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if (!userExist) throw new notFound("user does not exists");
    if (!categoryExist) throw new notFound("category does not exists");

    if (userExist.authId !== user.sub) throw new forbidden("unauthorized");

    if (categoryExist.userId !== userExist.id)
      throw new forbidden("unauthorized");

    return categoryExist;
  }

  async createCategory(user, dataToCreate) {
    const findUser = await verifyExistence("users", user.uid, prisma);
    if (!findUser) throw new unauthorized("log in again");

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

    if (!userExist) throw new notFound("user does not exists");

    const category = await this.getUniqueCategory(id, user);
    if (!category) throw new notFound("category does not exists");

    if (userExist.authId !== user.sub && user.role1 !== "ADMIN")
      throw new unauthorized("unauthorized");

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

    if (!category) throw new Error("category does not exists");
    if (category.userId !== user.uid) throw new Error("unauthorized");

    const deleted = await prisma.$transaction([
      prisma.notes.deleteMany({ where: { categoryId: id } }),
      prisma.categories.delete({ where: { id } }),
    ]);

    return id;
  }
}

module.exports = CategoryService;
