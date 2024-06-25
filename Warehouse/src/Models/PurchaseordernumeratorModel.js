module.exports = sequelize.define('purchaseordernumeratorModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Purchaseordervalue: {
        type: Sequelize.STRING
    },
    Createtime: {
        type: Sequelize.DATE
    },
    Isactive: {
        type: Sequelize.BOOLEAN
    }
}, {
    tableName: 'Purchaseordernumerators', // replace with the name of your existing table
    timestamps: false
});