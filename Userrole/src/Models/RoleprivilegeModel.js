module.exports = sequelize.define('roleprivilegeModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RoleID: {
        type: Sequelize.STRING
    },
    PrivilegeID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'roleprivileges', // replace with the name of your existing table
    timestamps: false
});