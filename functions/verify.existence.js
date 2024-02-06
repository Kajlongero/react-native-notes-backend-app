const verifyExistence = async (tablename, condition, connection) => {
  const dataFind = await connection[tablename].findUnique({
    where: {
      id: condition
    },
  });
  if(!dataFind)
    return false;

  return dataFind;
}

module.exports = verifyExistence;