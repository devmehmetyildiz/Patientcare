module.exports = sequelize.define('personelModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Name: {
        type: Sequelize.STRING
    },
    Surname: {
        type: Sequelize.STRING
    },
    CountryID: {
        type: Sequelize.STRING
    },
    Professions: {
        type: Sequelize.STRING
    },
    Workstarttime: {
        type: Sequelize.DATE
    },
    Gender: {
        type: Sequelize.STRING
    },
    ShiftID: {
        type: Sequelize.STRING
    },
    FloorID: {
        type: Sequelize.STRING
    },
    Iswildcard: {
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
    tableName: 'personels', // replace with the name of your existing table
    timestamps: false
});