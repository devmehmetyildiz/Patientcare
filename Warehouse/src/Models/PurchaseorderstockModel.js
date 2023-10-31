module.exports = sequelize.define('purchaseorderstockModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    PurchaseorderID: {
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
    Isredprescription: {
        type: Sequelize.BOOLEAN
    },
    Issupply: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
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
    tableName: 'purchaseorderstocks', // replace with the name of your existing table
    timestamps: false
});