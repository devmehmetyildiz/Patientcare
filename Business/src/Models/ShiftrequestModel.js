module.exports = sequelize.define('shiftrequestModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Startdate: {
        type: Sequelize.DATE
    },
    Enddate: {
        type: Sequelize.DATE
    },
    Period: {
        type: Sequelize.INTEGER
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
    tableName: 'shiftrequests', // replace with the name of your existing table
    timestamps: false
});