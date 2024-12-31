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
        type: Sequelize.DECIMAL(20, 4),
        allowNull: false,
        defaultValue: 0.0000
    },
    Totalcalculatedkdv: {
        type: Sequelize.DECIMAL(20, 4),
        allowNull: false,
        defaultValue: 0.0000
    },
    Totalcalculatedfinal: {
        type: Sequelize.DECIMAL(20, 4),
        allowNull: false,
        defaultValue: 0.0000
    },
    Totalcalculatedwithholding: {
        type: Sequelize.DECIMAL(20, 4),
        allowNull: false,
        defaultValue: 0.0000
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

    Reportdate: {
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