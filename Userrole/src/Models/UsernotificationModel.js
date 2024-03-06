module.exports = sequelize.define('usernotificationModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Notificationtype: {
        type: Sequelize.STRING
    },
    Notificationtime: {
        type: Sequelize.STRING
    },
    Subject: {
        type: Sequelize.STRING
    },
    Message: {
        type: Sequelize.STRING
    },
    Isshowed: {
        type: Sequelize.BOOLEAN
    },
    Showedtime: {
        type: Sequelize.DATE
    },
    Isreaded: {
        type: Sequelize.BOOLEAN
    },
    Readtime: {
        type: Sequelize.DATE
    },
    Pushurl: {
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
    tableName: 'usernotifications',
    timestamps: false
});