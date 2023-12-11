const { client, connection, pool } = require('./config').postgres


// knexfile.js
module.exports = {
    client,
    connection: {
      user: connection.user,
      password: connection.password,
      database: connection.database,
      host: connection.host
    },
    pool: {
      min: pool.min,
      max: pool.max
    },
    migrations: {
      tableName: 'knex_migrations',
      disableMigrationsListValidation: true
    }

  };
  
