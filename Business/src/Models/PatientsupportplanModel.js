module.exports = sequelize.define('patientsupportplanModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PatientID: {
        type: Sequelize.STRING
    },
    PlanID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'patientsupportplans', // replace with the name of your existing table
    timestamps: false
});