module.exports = sequelize.define('purchaseordermovementModel', {
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
    Type: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.STRING
    },
    Occureddate: {
        type: Sequelize.DATE
    },
}, {
    tableName: 'purchaseordermovements', // replace with the name of your existing table
    timestamps: false
});