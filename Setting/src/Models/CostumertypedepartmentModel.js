module.exports = sequelize.define('costumertypedepartmentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CostumertypeID: {
        type: Sequelize.STRING
    },
    DepartmentID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'costumertypedepartments', // replace with the name of your existing table
    timestamps: false
});