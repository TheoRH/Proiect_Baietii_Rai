import User from '../entities/User.js';

export async function createUser(data) {
  return await User.create(data);
}

export async function getUserByUsername(username) {
  return await User.findOne({ where: { username } });
}

export async function getUserById(id) {
  return await User.findByPk(id);
}

export async function getUsers() {
  return await User.findAll();
}

export async function deleteUser(id) {
  const result = await User.destroy({ where: { UserId: id } });
  if (result === 0) {
    throw new Error('Utilizatorul nu a fost gasit pentru a fi ;ters.');
  }
  return result;
}
