module.exports = sequelize.define('stockdefineModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Name: {
        type: Sequelize.STRING
    },
    StocktypeID: {
        type: Sequelize.STRING
    },
    Brand: {
        type: Sequelize.STRING
    },
    Barcode: {
        type: Sequelize.STRING
    },
    UnitID: {
        type: Sequelize.STRING
    },
    Info: {
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
    tableName: 'stockdefines', // replace with the name of your existing table
    timestamps: false
});