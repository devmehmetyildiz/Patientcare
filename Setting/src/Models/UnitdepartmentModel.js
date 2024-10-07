module.exports = sequelize.define('unitdepartmentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UnitID: {
        type: Sequelize.STRING
    },
    DepartmentID: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'unitdepartments', // replace with the name of your existing table
    timestamps: false
});