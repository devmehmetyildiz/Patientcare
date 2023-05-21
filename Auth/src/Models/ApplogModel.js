module.exports = sequelize.define('applogModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'applogs', // replace with the name of your existing table
    timestamps: false
});