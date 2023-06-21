module.exports = sequelize.define('rulelogModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    RuleID: {
        type: Sequelize.STRING
    },
    Log: {
        type: Sequelize.TEXT
    },
    Date: {
        type: Sequelize.DATE
    },
}, {
    tableName: 'rolelogs', // replace with the name of your existing table
    timestamps: false
});