module.exports = sequelize.define('trainingusersModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    Uuid: {
        type: Sequelize.STRING
    },

    TrainingID: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },

    Iscompleted: {
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
    tableName: 'trainingusers', // replace with the name of your existing table
    timestamps: false
});