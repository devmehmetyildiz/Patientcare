module.exports = sequelize.define('casedepartmentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CaseID: {
        type: Sequelize.STRING,
    },
    DepartmentID: {
        type: Sequelize.STRING,
    },
}, {
    tableName: 'casedepartments', // replace with the name of your existing table
    timestamps: false
});