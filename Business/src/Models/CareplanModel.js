module.exports = sequelize.define('careplanModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Startdate: {
        type: Sequelize.DATE
    },
    Enddate: {
        type: Sequelize.DATE
    },
    PatientID: {
        type: Sequelize.STRING
    },
    Needapprove: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Createdate: {
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
    tableName: 'careplans', // replace with the name of your existing table
    timestamps: false
});