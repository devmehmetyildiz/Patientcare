module.exports = sequelize.define('mainteanceplanModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    EquipmentID: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    Startdate: {
        type: Sequelize.DATE
    },
    Dayperiod: {
        type: Sequelize.INTEGER
    },
    Info: {
        type: Sequelize.TEXT
    },

    Isonpreview: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Iscompleted: {
        type: Sequelize.BOOLEAN
    },
    Isworking: {
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
    tableName: 'mainteanceplans', // replace with the name of your existing table
    timestamps: false
});