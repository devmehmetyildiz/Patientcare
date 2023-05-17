module.exports = sequelize.define('checkperiodperiodModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CheckperiodID: {
        type: Sequelize.STRING
    },
    PeriodID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'checkperiodperiods', // replace with the name of your existing table
    timestamps: false
});