module.exports = sequelize.define('passwordrefreshrequestModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING,
    },
    UserID: {
        type: Sequelize.STRING,
    },
    Emailsended: {
        type: Sequelize.BOOLEAN,
    },
    Reseturl: {
        type: Sequelize.STRING,
    },
    Emailconfirmed: {
        type: Sequelize.STRING,
    },
    Newpassword: {
        type: Sequelize.STRING
    },
    Oldpassword: {
        type: Sequelize.STRING
    },
    Userfetchedcount: {
        type: Sequelize.INTEGER
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
    tableName: 'passwordrefreshrequests', // replace with the name of your existing table
    timestamps: false
});