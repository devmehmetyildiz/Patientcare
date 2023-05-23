module.exports = sequelize.define('authlogModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'authlogs', // replace with the name of your existing table
    timestamps: false
});