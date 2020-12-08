import { rules } from './rules';

const checkAuth = function(accountType, role, action) {
  const permissions = rules[accountType];
  if(!permissions) {
    return false;
  }
  const staticPermissions = permissions.static;
  if (staticPermissions && staticPermissions.includes(action)) {
    return true;
  }
};
export { checkAuth };
