module.exports = sequelize.define('usermovementModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    MovementuserID: {
        type: Sequelize.STRING
    },
    CaseID: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.STRING
    },
    Occureddate: {
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
    tableName: 'usermovements',
    timestamps: false
});