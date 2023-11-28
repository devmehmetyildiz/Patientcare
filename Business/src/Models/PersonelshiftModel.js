module.exports = sequelize.define('personelshiftModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    ShiftrequestID: {
        type: Sequelize.STRING
    },
    PersonelID: {
        type: Sequelize.STRING
    },
    ShiftID: {
        type: Sequelize.STRING
    },
    FloorID: {
        type: Sequelize.STRING
    },
    Occuredday: {
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
    tableName: 'personelshifts', // replace with the name of your existing table
    timestamps: false
});