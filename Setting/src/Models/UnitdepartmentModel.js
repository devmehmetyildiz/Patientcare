module.exports = sequelize.define('unitdepartmentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UnitId: {
        type: Sequelize.STRING
    },
    DepartmentId: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'unitdepartments', // replace with the name of your existing table
    timestamps: false
});