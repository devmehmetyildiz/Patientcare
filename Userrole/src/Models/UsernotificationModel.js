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
    Isreaded: {
        type: Sequelize.BOOLEAN
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