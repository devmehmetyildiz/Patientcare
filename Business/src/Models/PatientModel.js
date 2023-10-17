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
    Registerdate: {
        type: Sequelize.DATE
    },
    Releasedate: {
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
    Iswaitingactivation: {
        type: Sequelize.BOOLEAN
    },
    WarehouseID: {
        type: Sequelize.STRING
    },
    ImageID: {
        type: Sequelize.STRING
    },
    CheckperiodID: {
        type: Sequelize.STRING
    },
    TodogroupdefineID: {
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