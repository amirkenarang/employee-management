const roles = ['user', 'admin'];

const roleRights = new Map();
// User Role
roleRights.set(roles[0], [
  'getUser',
  'manageUsers',
]);

// Intern Role
roleRights.set(roles[1], [
  'getUser',
  'manageUsers',
]);

module.exports = {
  roles,
  roleRights,
};
