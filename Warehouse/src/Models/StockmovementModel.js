module.exports = sequelize.define('stockmovementModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    StockID: {
        type: Sequelize.STRING
    },
    Movementtype: {
        type: Sequelize.INTEGER
    },
    Amount: {
        type: Sequelize.DOUBLE
    },
    Prevvalue: {
        type: Sequelize.DOUBLE
    },
    Newvalue: {
        type: Sequelize.DOUBLE
    },
    Movementdate: {
        type: Sequelize.DATE
    },
    Status: {
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
    tableName: 'stockmovements', // replace with the name of your existing table
    timestamps: false
});