module.exports = sequelize.define('professionpresettingModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Startdate: {
        type: Sequelize.DATE
    },
    Enddate: {
        type: Sequelize.DATE
    },
    FloorID: {
        type: Sequelize.STRING
    },
    ProfessionID: {
        type: Sequelize.STRING
    },
    ShiftID: {
        type: Sequelize.STRING
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Iscompleted: {
        type: Sequelize.BOOLEAN
    },
    Isinfinite: {
        type: Sequelize.BOOLEAN
    },
    Isdeactive: {
        type: Sequelize.BOOLEAN
    },
    Ispersonelstay: {
        type: Sequelize.BOOLEAN
    },
    Minpersonelcount: {
        type: Sequelize.INTEGER
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
    tableName: 'professionpresettings', // replace with the name of your existing table
    timestamps: false
});