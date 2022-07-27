const uniqueId = (author, moduleName, category, id) => `@${author}:${moduleName}:${category}:${id}`

module.exports = { uniqueId }
