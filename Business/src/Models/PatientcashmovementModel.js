module.exports = sequelize.define('patientcashmovementModel', {
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
    RegisterID: {
        type: Sequelize.STRING
    },
    Movementtype: {
        type: Sequelize.INTEGER
    },
    Movementvalue: {
        type: Sequelize.FLOAT
    },
    Movementdate: {
        type: Sequelize.DATE
    },
    Info: {
        type: Sequelize.STRING
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
    tableName: 'patientcashmovements', // replace with the name of your existing table
    timestamps: false
});