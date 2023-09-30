module.exports = sequelize.define('stockModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    WarehouseID: {
        type: Sequelize.STRING
    },
    Isonusage: {
        type: Sequelize.BOOLEAN
    },
    Isdeactive: {
        type: Sequelize.BOOLEAN
    },
    Deactivetime: {
        type: Sequelize.DATE
    },
    Source: {
        type: Sequelize.STRING
    },
    StockdefineID: {
        type: Sequelize.STRING
    },
    DepartmentID: {
        type: Sequelize.STRING
    },
    Ismedicine: {
        type: Sequelize.BOOLEAN
    },
    Skt: {
        type: Sequelize.DATE
    },
    Barcodeno: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.STRING
    },
    Willdelete: {
        type: Sequelize.BOOLEAN
    },
    Status: {
        type: Sequelize.INTEGER
    },
    Order: {
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
    tableName: 'stocks', // replace with the name of your existing table
    timestamps: false
});