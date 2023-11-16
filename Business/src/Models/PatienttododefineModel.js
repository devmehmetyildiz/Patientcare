module.exports = sequelize.define('patienttododefineModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PatientID: {
        type: Sequelize.STRING
    },
    TododefineID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'patienttododefines', // replace with the name of your existing table
    timestamps: false
});