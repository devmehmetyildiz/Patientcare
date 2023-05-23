module.exports = sequelize.define('settinglogModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'settinglogs', // replace with the name of your existing table
    timestamps: false
});