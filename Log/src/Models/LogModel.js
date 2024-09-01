module.exports = sequelize.define('logModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Service: {
        type: Sequelize.STRING
    },
    UserID: {
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
    Requestdata: {
        type: Sequelize.TEXT
    },
    Responsedata: {
        type: Sequelize.TEXT
    },
    Createtime: {
        type: Sequelize.DATE
    },
}, {
    tableName: 'logs', // replace with the name of your existing table
    timestamps: false
});