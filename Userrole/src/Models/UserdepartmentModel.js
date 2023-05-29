module.exports = sequelize.define('userdepartmentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    DepartmentID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'userDepartments', // replace with the name of your existing table
    timestamps: false
});