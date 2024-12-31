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
        type: Sequelize.DECIMAL(20, 4),
    },
    Calculatedpayment: {
        type: Sequelize.DECIMAL(20, 4),
    },
    Calculatedkdv: {
        type: Sequelize.DECIMAL(20, 4),
    },
    Calculatedfinal: {
        type: Sequelize.DECIMAL(20, 4),
    },
    Calculatedwithholding: {
        type: Sequelize.DECIMAL(20, 4),
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