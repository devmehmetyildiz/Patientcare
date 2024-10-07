module.exports = sequelize.define('departmentstationModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DepartmentID: {
        type: Sequelize.STRING
    },
    StationID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'departmentstations', // replace with the name of your existing table
    timestamps: false
});