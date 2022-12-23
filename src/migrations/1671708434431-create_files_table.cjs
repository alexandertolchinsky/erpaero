const { MigrationInterface, QueryRunner, Table } = require("typeorm");

module.exports = class createFilesTable1671708434431 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'extension',
            type: 'varchar',
          },
          {
            name: 'mimetype',
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'varchar',
          },
          {
            name: 'path',
            type: 'varchar',
          },
          {
            name: 'upload_date',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    )
  }

  async down(queryRunner) {
    await queryRunner.dropTable('files');
  }
}
