export const ExceptionTypes = {
  UNIQUE: (field = 'fields') => `User with this ${field} already exist `,
  PASSWORD: 'Wrong Password',
  NONEXISTENT: (field = 'record') => `The ${field} does not exist`,
  CODE_EXPIRED: 'Code has expired',
  UNKNOWN_ACT: 'Unknown act',
  UNEXPECTED_ERROR: 'Unexpected exception',
  BLACKLIST_TOKEN: 'Token blocked',
};
