const { connection: prisma } = require('../connections/prisma.connection');
const { notFound, unauthorized, forbidden } = require('@hapi/boom');
const verifyExistence = require('../functions/verify.existence');

class CategoryService {

  async listCategoriesByUser ({ id }, skip, take) {
    const userExist = await verifyExistence('users', id, prisma);
    
    if(!userExist) throw new Error('user does not exists');

    const categories = await prisma.categories.findMany({
      where: {
        userId: id,
      },
      skip: skip ?? 0,
      take: take ?? 30,
    });

    return categories;
  }

  async getAll () {
    const categories = await prisma.categories.findMany({
      skip: 0,
      take: 30,
    });
    return categories;
  }

  async getUniqueCategory (id, user) {
    const [categoryExist, userExist] = await Promise.all([
      prisma.categories.findUnique({ where: { id } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if(!userExist) throw new notFound('user does not exists')
    if(!categoryExist) throw new notFound('category does not exists')

    if(userExist.authId !== user.sub) throw new forbidden('unauthorized');

    if(category.userId !== findUser.id && user.role !== 'ADMIN') 
      throw new forbidden('unauthorized');  

    return category;
  }

  async createCategory(user, dataToCreate) {
    const findUser = await verifyExistence('users', user.uid, prisma);
    
    if(!findUser)
      throw new Error('user does not exists');

    const created = await prisma.categories.create({
      data: {
        ...dataToCreate,
        userId: user.uid,
      },
    });

    return created;
  }

  async editCategory (id, dataToModify) {
    const [userExist, categoryExist] = await Promise.all([
      prisma.users.findUnique({ where: { id } }),
      prisma.categories.findUnique({ where: { id: user.uid } }),
    ]);

    if(!categoryExist) throw new notFound('category does not exists')
    if(!userExist) throw new notFound('user does not exists')

    if(userExist.authId !== user.sub && user.role1 !== 'ADMIN') 
      throw new unauthorized('unauthorized');

    const modify = await prisma.categories.update({
      where: {
        id,
      },
      data: {
        ...dataToModify,
      }
    });

    return modify;
  }

  async deleteCategory (user, id) {
    const category = await verifyExistence('categories', id, prisma);
    
    if(!category) throw new Error('category does not exists');
    if(category.userId !== user.id) throw new Error('unauthorized');

    const deleted = Promise.all([
      prisma.categories.delete({ where: { id } }),
      prisma.notes.deleteMany({ where: { categoryId: id } })
    ]);

    return "deleted successfully";
  }

}

module.exports = new CategoryService();