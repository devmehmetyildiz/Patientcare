module.exports = sequelize.define('accesstokenModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Userid: {
        type: Sequelize.STRING,
    },
    Accesstoken: {
        type: Sequelize.STRING,
    },
    Refreshtoken: {
        type: Sequelize.STRING,
    },
    ExpiresAt: {
        type: Sequelize.DATE,
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
    tableName: 'accessTokens', // replace with the name of your existing table
    timestamps: false
});