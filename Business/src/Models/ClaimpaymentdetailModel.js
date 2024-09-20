module.exports = sequelize.define('claimpaymentdetailModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    ParentID: {
        type: Sequelize.STRING
    },
    PatientID: {
        type: Sequelize.STRING
    },

    Daycount: {
        type: Sequelize.INTEGER
    },
    Unitpayment: {
        type: Sequelize.FLOAT
    },
    Calculatedpayment: {
        type: Sequelize.FLOAT
    },
    Calculatedkdv: {
        type: Sequelize.FLOAT
    },
    Calculatedfinal: {
        type: Sequelize.FLOAT
    },
    Calculatedwithholding: {
        type: Sequelize.FLOAT
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
    tableName: 'claimpaymentdetails', // replace with the name of your existing table
    timestamps: false
});