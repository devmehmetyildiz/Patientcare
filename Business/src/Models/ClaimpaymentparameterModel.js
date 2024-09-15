module.exports = sequelize.define('claimpaymentparameterModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },

    Type: {
        type: Sequelize.INTEGER
    },
    CostumertypeID: {
        type: Sequelize.STRING
    },
    Patientclaimpaymentperpayment: {
        type: Sequelize.FLOAT
    },

    Issettingactive: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Approveduser: {
        type: Sequelize.STRING
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
    tableName: 'claimpaymentparameters', // replace with the name of your existing table
    timestamps: false
});