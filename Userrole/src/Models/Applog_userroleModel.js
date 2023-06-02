module.exports = sequelize.define('applog_userroleModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'applog_userrole', // replace with the name of your existing table
    timestamps: false
});