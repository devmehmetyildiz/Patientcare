module.exports = sequelize.define('logModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Servername: {
        type: Sequelize.STRING
    },
    RequestuserID: {
        type: Sequelize.STRING
    },
    Requesttype: {
        type: Sequelize.STRING
    },
    Requesturl: {
        type: Sequelize.STRING
    },
    Requestip: {
        type: Sequelize.STRING
    },
    Targeturl: {
        type: Sequelize.STRING
    },
    Status: {
        type: Sequelize.STRING
    },
    Data: {
        type: Sequelize.TEXT
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
    tableName: 'logs', // replace with the name of your existing table
    timestamps: false
});