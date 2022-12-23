import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
    },
    password_digest: {
      type: 'varchar',
    },
    token: {
      type: 'varchar',
    },
    refresh_token: {
      type: 'varchar',
    },
  },
});
