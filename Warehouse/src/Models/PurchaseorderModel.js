module.exports = sequelize.define('purchaseorderModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.STRING
    },
    Company: {
        type: Sequelize.STRING
    },
    Username: {
        type: Sequelize.STRING
    },
    Purchaseprice: {
        type: Sequelize.DOUBLE
    },
    Purchasenumber: {
        type: Sequelize.STRING
    },
    Companypersonelname: {
        type: Sequelize.STRING
    },
    Personelname: {
        type: Sequelize.STRING
    },
    Purchasedate: {
        type: Sequelize.DATE
    },
    WarehouseID: {
        type: Sequelize.STRING
    },
    CaseID: {
        type: Sequelize.STRING
    },
    Isapproved: {
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
    tableName: 'purchaseorders', // replace with the name of your existing table
    timestamps: false
});