module.exports = sequelize.define('companycashmovementModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Movementtype: {
        type: Sequelize.INTEGER
    },
    Movementvalue: {
        type: Sequelize.FLOAT
    },
    ReportID: {
        type: Sequelize.STRING
    },
    Info: {
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
    tableName: 'companycashmovements', // replace with the name of your existing table
    timestamps: false
});