module.exports = sequelize.define('tododefineperiodModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TododefineID: {
        type: Sequelize.STRING
    },
    PeriodID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'tododefineperiods', // replace with the name of your existing table
    timestamps: false
});