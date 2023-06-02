module.exports = sequelize.define('applog_warehouseModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    }
}, {
    tableName: 'applog_warehouse', // replace with the name of your existing table
    timestamps: false
});