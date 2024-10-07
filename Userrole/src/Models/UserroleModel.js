module.exports = sequelize.define('userroleModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    RoleID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'userroles', // replace with the name of your existing table
    timestamps: false
});