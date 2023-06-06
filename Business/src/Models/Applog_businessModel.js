module.exports = sequelize.define('applog_businessModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    }
}, {
    tableName: 'applog_businessModel', // replace with the name of your existing table
    timestamps: false
});