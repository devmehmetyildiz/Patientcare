module.exports = sequelize.define('purchaseorderModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },

    Purchaseno: {
        type: Sequelize.STRING
    },
    Company: {
        type: Sequelize.STRING
    },
    Delivereruser: {
        type: Sequelize.STRING
    },
    ReceiveruserID: {
        type: Sequelize.STRING
    },
    Deliverytype: {
        type: Sequelize.INTEGER
    },
    DeliverypatientID: {
        type: Sequelize.STRING
    },
    DeliverywarehouseID: {
        type: Sequelize.STRING
    },

    Price: {
        type: Sequelize.DOUBLE
    },
    Billno: {
        type: Sequelize.STRING
    },
    Info: {
        type: Sequelize.TEXT
    },
    CaseID: {
        type: Sequelize.STRING
    },

    Purchasecreatetime: {
        type: Sequelize.DATE
    },
    Purchasechecktime: {
        type: Sequelize.DATE
    },
    Purchaseapprovetime: {
        type: Sequelize.DATE
    },
    Purchasecompletetime: {
        type: Sequelize.DATE
    },
    CreateduserID: {
        type: Sequelize.STRING
    },
    CheckeduserID: {
        type: Sequelize.STRING
    },
    ApproveduserID: {
        type: Sequelize.STRING
    },
    CompleteduserID: {
        type: Sequelize.STRING
    },
    Isopened: {
        type: Sequelize.BOOLEAN
    },
    Ischecked: {
        type: Sequelize.BOOLEAN
    },
    Isapproved: {
        type: Sequelize.BOOLEAN
    },
    Iscompleted: {
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
    tableName: 'purchaseorders', // replace with the name of your existing table
    timestamps: false
});