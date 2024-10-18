module.exports = sequelize.define('patienteventmovementModel', {
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
    EventID: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Occureddate: {
        type: Sequelize.DATE
    },
    Relatedpersons: {
        type: Sequelize.STRING
    },
    Solutiontime: {
        type: Sequelize.STRING
    },
    Eventdetail: {
        type: Sequelize.TEXT
    },
    OccuredFloorID: {
        type: Sequelize.STRING
    },
    Occuredplace: {
        type: Sequelize.STRING
    },
    Result: {
        type: Sequelize.STRING
    },
    Witnesses: {
        type: Sequelize.STRING
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
    tableName: 'patienteventmovements',
    timestamps: false
});