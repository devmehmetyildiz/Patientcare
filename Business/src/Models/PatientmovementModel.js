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
    Patientmovementtype: {
        type: Sequelize.INTEGER
    },
    IsDeactive: {
        type: Sequelize.BOOLEAN
    },
    OldPatientmovementtype: {
        type: Sequelize.INTEGER
    },
    NewPatientmovementtype: {
        type: Sequelize.INTEGER
    },
    IsTodoneed: {
        type: Sequelize.BOOLEAN
    },
    IsTodocompleted: {
        type: Sequelize.BOOLEAN
    },
    IsComplated: {
        type: Sequelize.BOOLEAN
    },
    Iswaitingactivation: {
        type: Sequelize.BOOLEAN
    },
    Movementdate: {
        type: Sequelize.DATE
    },
    Createduser: {
        type: Sequelize.STRING
    },
    Createtime: {
        type: Sequelize.DATE
    },
    Updateduser: {
        type: Sequelize.STRING
    },
    Updatetime: {
        type: Sequelize.DATE
    },
    Deleteduser: {
        type: Sequelize.STRING
    },
    Deletetime: {
        type: Sequelize.DATE
    },
    Isactive: {
        type: Sequelize.BOOLEAN
    }
}, {
    tableName: 'patientmovements', // replace with the name of your existing table
    timestamps: false
});