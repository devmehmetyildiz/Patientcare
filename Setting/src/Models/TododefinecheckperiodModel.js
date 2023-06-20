module.exports = sequelize.define('tododefinecheckperiodModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TododefineID: {
        type: Sequelize.STRING
    },
    CheckperiodID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'tododefinecheckperiods', // replace with the name of your existing table
    timestamps: false
});