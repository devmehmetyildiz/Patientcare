module.exports = sequelize.define('applog_fileModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'applog_file', // replace with the name of your existing table
    timestamps: false
});