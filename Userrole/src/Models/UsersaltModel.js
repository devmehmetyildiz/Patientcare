module.exports = sequelize.define('usersaltModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    Salt: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'usersalts', // replace with the name of your existing table
    timestamps: false
});