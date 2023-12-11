
module.exports = {
    postgres: {
        client: 'pg',
        connection: {
            user: 'postgres',
            host: 'localhost',
            database: 'sass_database',
            password: 'BaMyY1&5',
          },
        pool: { min: 0, max: 10, idleTimeoutMillis: 10000, acquireTimeoutMillis: 600000 }
    }
}