module.exports = sequelize.define('mainteanceModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Starttime: {
        type: Sequelize.DATE
    },
    Endtime: {
        type: Sequelize.DATE
    },
    EquipmentID: {
        type: Sequelize.STRING
    },
    ResponsibleuserID: {
        type: Sequelize.STRING
    },
    Openinfo: {
        type: Sequelize.STRING
    },
    Closeinfo: {
        type: Sequelize.STRING
    },
    Iscompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    tableName: 'maintenances', // replace with the name of your existing table
    timestamps: false
});