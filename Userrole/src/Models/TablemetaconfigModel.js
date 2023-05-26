module.exports = sequelize.define('tablemetaconfigModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    Meta: {
        type: Sequelize.STRING
    },
    Config: {
        type: Sequelize.TEXT
    }
}, {
    tableName: 'tablemetaconfigs', // replace with the name of your existing table
    timestamps: false
});