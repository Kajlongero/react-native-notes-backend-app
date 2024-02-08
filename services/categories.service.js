const { connection: prisma } = require('../connections/prisma.connection');
const { notFound, unauthorized, forbidden } = require('@hapi/boom');
const verifyExistence = require('../functions/verify.existence');

class CategoryService {

  async categoriesByUser (user, skip = 0, take = 30) {
    const userExist = await verifyExistence('users', user.uid, prisma);
    if(!userExist) throw new unauthorized();
    
    const categories = await prisma.categories.findMany({
      where: {
        userId: user.uid,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        notes: true,
      }
    });

    return categories;
  }

  async getAll (skip, take) {
    const categories = await prisma.categories.findMany({
      skip: parseInt(skip),
      take: parseInt(take)
    });
    return categories;
  }

  async getUniqueCategory (id, user) {
    const [categoryExist, userExist] = await Promise.all([
      prisma.categories.findUnique({ where: { id }, include: { notes: true } }),
      prisma.users.findUnique({ where: { id: user.uid } }),
    ]);

    if(!userExist) throw new notFound('user does not exists')
    if(!categoryExist) throw new notFound('category does not exists')

    if(userExist.authId !== user.sub) throw new forbidden('unauthorized');

    if(categoryExist.userId !== userExist.id) 
      throw new forbidden('unauthorized');  

    return categoryExist;
  }

  async createCategory(user, dataToCreate) {
    const findUser = await verifyExistence('users', user.uid, prisma);
    
    if(!findUser)
      throw new unauthorized('log in again');

    const created = await prisma.categories.create({
      data: {
        ...dataToCreate,
        userId: user.uid,
      },
    });

    return created;
  }

  async editCategory (id, user, dataToModify) {
    const userExist = await verifyExistence('users', user.uid, prisma);
    
    if(!userExist) throw new notFound('user does not exists')

    const category = await this.getUniqueCategory(id, user);
    if(!category) throw new notFound('category does not exists')

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

  async deleteCategory (id, user) {
    const category = await verifyExistence('categories', id, prisma);
    
    if(!category) throw new Error('category does not exists');
    if(category.userId !== user.uid) throw new Error('unauthorized');

    const deleted = Promise.all([
      prisma.categories.delete({ where: { id } }),
      prisma.notes.deleteMany({ where: { categoryId: id } })
    ]);

    return id;
  }

}

module.exports = CategoryService;