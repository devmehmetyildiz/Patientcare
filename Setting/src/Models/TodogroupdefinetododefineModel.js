module.exports = sequelize.define('todogroupdefinetododefineModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    GroupID: {
        type: Sequelize.STRING
    },
    TodoID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'todogroupdefinetododefines', // replace with the name of your existing table
    timestamps: false
});