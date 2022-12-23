const { MigrationInterface, QueryRunner, Table } = require("typeorm");

module.exports = class createUsersTable1671797698609 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'password_digest',
            type: 'varchar',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'refresh_token',
            type: 'varchar',
          },
        ],
      }),
      true,
    )
  }

  async down(queryRunner) {
    await queryRunner.dropTable('users');
  }
}
