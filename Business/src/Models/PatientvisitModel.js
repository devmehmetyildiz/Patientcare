module.exports = sequelize.define('patientvisitModel', {
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

    Contactname: {
        type: Sequelize.STRING
    },
    Contactstatus: {
        type: Sequelize.STRING
    },

    Starttime: {
        type: Sequelize.DATE
    },
    Endtime: {
        type: Sequelize.DATE
    },

    Info: {
        type: Sequelize.TEXT
    },

    ParticipateuserID: {
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
    tableName: 'patientvisits',
    timestamps: false
});