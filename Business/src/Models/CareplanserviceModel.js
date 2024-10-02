module.exports = sequelize.define('careplanserviceModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    CareplanID: {
        type: Sequelize.STRING
    },
    SupportplanID: {
        type: Sequelize.STRING
    },
    Helpstatus: {
        type: Sequelize.STRING
    },
    Presentationperiod: {
        type: Sequelize.STRING
    },
    Presentationmakingtype: {
        type: Sequelize.STRING
    },
    Rating: {
        type: Sequelize.STRING
    },
    Currentsituationrati̇ng: {
        type: Sequelize.STRING
    },
    Plannedsituationrati̇ng: {
        type: Sequelize.STRING
    },
    Purposetarget: {
        type: Sequelize.STRING
    },
    Purposetargetworks: {
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
    tableName: 'careplanservices', // replace with the name of your existing table
    timestamps: false
});