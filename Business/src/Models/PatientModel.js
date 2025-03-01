module.exports = sequelize.define('patientModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },

    PatientdefineID: {
        type: Sequelize.STRING
    },
    Patientstatus: {
        type: Sequelize.INTEGER
    },

    Approvaldate: {
        type: Sequelize.DATE
    },
    Releasedate: {
        type: Sequelize.DATE
    },
    Info: {
        type: Sequelize.TEXT
    },
    Guardiannote: {
        type: Sequelize.TEXT
    },
    Happensdate: {
        type: Sequelize.DATE
    },
    Leavedate: {
        type: Sequelize.DATE
    },
    Deathdate: {
        type: Sequelize.DATE
    },


    RoomID: {
        type: Sequelize.STRING
    },
    FloorID: {
        type: Sequelize.STRING
    },
    BedID: {
        type: Sequelize.STRING
    },

    DepartmentID: {
        type: Sequelize.STRING
    },

    Patientcreatetime: {
        type: Sequelize.DATE
    },
    Patientchecktime: {
        type: Sequelize.DATE
    },
    Patientapprovetime: {
        type: Sequelize.DATE
    },
    Patientcompletetime: {
        type: Sequelize.DATE
    },
    CreateduserID: {
        type: Sequelize.STRING
    },
    CheckeduserID: {
        type: Sequelize.STRING
    },
    ApproveduserID: {
        type: Sequelize.STRING
    },
    CompleteduserID: {
        type: Sequelize.STRING
    },

    Ischecked: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Ispreregistration: {
        type: Sequelize.BOOLEAN
    },
    Isalive: {
        type: Sequelize.BOOLEAN
    },
    Isleft: {
        type: Sequelize.BOOLEAN
    },

    Leftinfo: {
        type: Sequelize.STRING
    },
    Deadinfo: {
        type: Sequelize.STRING
    },

    CaseID: {
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
    tableName: 'patients', // replace with the name of your existing table
    timestamps: false
});