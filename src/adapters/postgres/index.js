const knex = require('knex');

const knexConfig = require('../../knexfile');

const db = knex(knexConfig);

module.exports = {
    create,
    find,
    update
}


async function create(tableName, fields) {
    try {
        const result = await db(tableName).insert({
            ...fields 
            }).returning('*')
        return result
    } catch (error) {
        console.debug({
            message: error.message,
            args: { tableName, fields }
          }, `PG Query Error ${tableName}`)
        return null
    }
}

async function find(tableName,conditions) {
    try {
        const user = await db(tableName).select('*').where(conditions)
        return user
    } catch (error) {
        console.debug({
            message: error.message,
            args: { tableName, fields }
          }, `PG Query Error ${tableName}`)
        return null
    }
}

async function update(tableName, fields, conditions) {
    try {
        const result = await db(tableName).update({
            ...fields 
            }).where({...conditions}).returning('*');
        return result
    } catch (error) {
        console.debug({
            message: error.message,
            args: { tableName, fields }
          }, `PG Query Error ${tableName}`)
        return null
    }
}