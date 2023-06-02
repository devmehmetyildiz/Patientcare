module.exports = sequelize.define('mailsettingModel', {
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
    User: {
        type: Sequelize.STRING
    },
    Password: {
        type: Sequelize.STRING
    },
    Smtphost: {
        type: Sequelize.STRING
    },
    Smtpport: {
        type: Sequelize.STRING
    },
    Mailaddress: {
        type: Sequelize.STRING
    },
    Isbodyhtml: {
        type: Sequelize.BOOLEAN
    },
    Issettingactive: {
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
    tableName: 'mailsettings', // replace with the name of your existing table
    timestamps: false
});