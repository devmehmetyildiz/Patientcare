module.exports = sequelize.define('patientstockmovementModel', {
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
    Isapproved: {
        type: Sequelize.BOOLEAN
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
    Isapproved: {
        type: Sequelize.BOOLEAN
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
    tableName: 'patientstockmovements', // replace with the name of your existing table
    timestamps: false
});