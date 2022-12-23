import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'File',
  tableName: 'files',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    extension: {
      type: 'varchar',
    },
    mimetype: {
      type: 'varchar',
    },
    size: {
      type: 'varchar',
    },
    path: {
      type: 'varchar',
    },
    upload_date: {
      type: 'timestamp',
      createDate: true,
    },
  },
});
