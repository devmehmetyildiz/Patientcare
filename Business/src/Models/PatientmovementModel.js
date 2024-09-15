module.exports = sequelize.define('patientmovementModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    PatientID: {
        type: Sequelize.STRING
    },
    CaseID: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.STRING
    },
    Occureddate: {
        type: Sequelize.DATE
    },
}, {
    tableName: 'patientmovements',
    timestamps: false
});