module.exports = sequelize.define('personelshiftModel', {
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
    ProfessionID: {
        type: Sequelize.STRING
    },
    Isworking: {
        type: Sequelize.BOOLEAN
    },
    Isdeactive: {
        type: Sequelize.BOOLEAN
    },
    Iscompleted: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
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
    tableName: 'personelshifts', // replace with the name of your existing table
    timestamps: false
});