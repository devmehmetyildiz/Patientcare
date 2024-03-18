module.exports = sequelize.define('personelshiftdetailModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    PersonelshiftID: {
        type: Sequelize.STRING
    },
    ShiftID: {
        type: Sequelize.STRING
    },
    PersonelID: {
        type: Sequelize.STRING
    },
    FloorID: {
        type: Sequelize.STRING
    },
    Day: {
        type: Sequelize.INTEGER
    },
    Isworking: {
        type: Sequelize.BOOLEAN
    },
    Isonannual: {
        type: Sequelize.BOOLEAN
    },
    Annualtype: {
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
    tableName: 'personelshiftdetails', // replace with the name of your existing table
    timestamps: false
});