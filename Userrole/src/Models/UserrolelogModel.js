module.exports = sequelize.define('userrolelogModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Event: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'userrolelogs', // replace with the name of your existing table
    timestamps: false
});