module.exports = sequelize.define('applog_systemModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    }
}, {
    tableName: 'applog_system', // replace with the name of your existing table
    timestamps: false
});