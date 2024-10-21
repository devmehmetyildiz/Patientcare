module.exports = sequelize.define('surveyModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },

    Type: {
        type: Sequelize.STRING
    },

    Name: {
        type: Sequelize.STRING
    },
    Description: {
        type: Sequelize.STRING
    },
    PrepareduserID: {
        type: Sequelize.STRING
    },

    Minnumber: {
        type: Sequelize.INTEGER
    },
    Maxnumber: {
        type: Sequelize.INTEGER
    },

    Isonpreview: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Iscompleted: {
        type: Sequelize.BOOLEAN
    },

    Completedusercount: {
        type: Sequelize.INTEGER
    },

    Approveduser: {
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
    tableName: 'surveyModel', // replace with the name of your existing table
    timestamps: false
});