module.exports = sequelize.define('stockModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Order: {
        type: Sequelize.INTEGER
    },
    WarehouseID: {
        type: Sequelize.STRING
    },
    Type: {
        type: Sequelize.INTEGER
    },
    Amount: {
        type: Sequelize.DOUBLE
    },
    StocktypeID: {
        type: Sequelize.STRING
    },
    StockgrouptypeID: {
        type: Sequelize.STRING
    },
    StockdefineID: {
        type: Sequelize.STRING
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Isdeactivated: {
        type: Sequelize.BOOLEAN
    },
    Deactivateinfo: {
        type: Sequelize.STRING
    },
    Skt: {
        type: Sequelize.DATE
    },
    Info: {
        type: Sequelize.TEXT
    },
    Iscompleted: {
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
    tableName: 'stocks', // replace with the name of your existing table
    timestamps: false
});