module.exports = sequelize.define('userstationModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    StationID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'userstations', // replace with the name of your existing table
    timestamps: false
});