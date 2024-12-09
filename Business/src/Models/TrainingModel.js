module.exports = sequelize.define('trainingModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.INTEGER
    },
    Typedetail: {
        type: Sequelize.INTEGER
    },

    Name: {
        type: Sequelize.STRING
    },
    
    Trainingdate: {
        type: Sequelize.DATE
    },

    Description: {
        type: Sequelize.STRING
    },
    Place: {
        type: Sequelize.STRING
    },
    Duration: {
        type: Sequelize.STRING
    },

    Companyname: {
        type: Sequelize.STRING
    },
    Educator: {
        type: Sequelize.STRING
    },

    EducatoruserID: {
        type: Sequelize.STRING
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

    Approvetime: {
        type: Sequelize.DATE
    },
    Completedtime: {
        type: Sequelize.DATE
    },
    Approveduser: {
        type: Sequelize.STRING
    },
    Completeduser: {
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
    tableName: 'training', // replace with the name of your existing table
    timestamps: false
});