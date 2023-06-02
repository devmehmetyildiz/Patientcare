module.exports = sequelize.define('todoModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    MovementID: {
        type: Sequelize.STRING
    },
    TododefineID: {
        type: Sequelize.STRING
    },
    Order: {
        type: Sequelize.INTEGER
    },
    IsCompleted: {
        type: Sequelize.BOOLEAN
    },
    Createduser: {
        type: Sequelize.STRING
    },
    Createtime: {
        type: Sequelize.DATE
    },
    Updateduser: {
        type: Sequelize.STRING
    },
    Updatetime: {
        type: Sequelize.DATE
    },
    Deleteduser: {
        type: Sequelize.STRING
    },
    Deletetime: {
        type: Sequelize.DATE
    },
    Isactive: {
        type: Sequelize.BOOLEAN
    }
}, {
    tableName: 'todos', // replace with the name of your existing table
    timestamps: false
});