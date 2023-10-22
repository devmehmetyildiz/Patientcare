module.exports = sequelize.define('caseModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Name: {
        type: Sequelize.STRING
    },
    Shortname: {
        type: Sequelize.STRING
    },
    Casecolor: {
        type: Sequelize.STRING
    },
    CaseStatus: {
        type: Sequelize.INTEGER
    },
    Patientstatus: {
        type: Sequelize.INTEGER
    },
    Iscalculateprice: {
        type: Sequelize.BOOLEAN
    },
    Isroutinework: {
        type: Sequelize.BOOLEAN
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
    tableName: 'cases', // replace with the name of your existing table
    timestamps: false
});