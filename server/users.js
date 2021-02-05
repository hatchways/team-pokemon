const users = [];

const addUser = ({ userId, room }) => {
  const existingUser = users.find(user => {
    return user.room === room && user.id === userId;
  });

  if (existingUser !== undefined) {
    return;
  }
  const user = { id: userId, room: room };
  users.push(user);
  return { user };
};

const getUser = ({ userId, chatId }) => {
  return users.find(user => user.id === userId && user.room === chatId);
};

module.exports = { addUser, getUser };
