module.exports = sequelize.define('claimpaymentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },


    Name: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.TEXT
    },

    Type: {
        type: Sequelize.INTEGER
    },

    Totaldaycount: {
        type: Sequelize.INTEGER
    },
    Totalcalculatedpayment: {
        type: Sequelize.FLOAT
    },
    Totalcalculatedkdv: {
        type: Sequelize.FLOAT
    },
    Totalcalculatedfinal: {
        type: Sequelize.FLOAT
    },
    Totalcalculatedwithholding: {
        type: Sequelize.FLOAT
    },

    Isonpreview: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Approveduser: {
        type: Sequelize.STRING
    },
    Approvetime: {
        type: Sequelize.DATE
    },

    Starttime: {
        type: Sequelize.DATE
    },
    Endtime: {
        type: Sequelize.DATE
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
    tableName: 'claimpayments', // replace with the name of your existing table
    timestamps: false
});