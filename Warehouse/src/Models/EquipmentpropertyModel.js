module.exports = sequelize.define('equipmentpropertyModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    EquipmentID: {
        type: Sequelize.STRING
    },
    Order: {
        type: Sequelize.INTEGER,
    },
    Propertyname: {
        type: Sequelize.STRING
    },
    Propertyvalue: {
        type: Sequelize.STRING
    },
}, {
    tableName: 'Equipmentproperties', // replace with the name of your existing table
    timestamps: false
});