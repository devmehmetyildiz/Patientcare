module.exports = sequelize.define('userincidentModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },

    UserID: {
        type: Sequelize.STRING
    },

    Type: {
        type: Sequelize.INTEGER
    },

    Event: {
        type: Sequelize.TEXT
    },
    Eventdetail: {
        type: Sequelize.TEXT
    },
    Result: {
        type: Sequelize.TEXT
    },

    Occuredtime: {
        type: Sequelize.DATE
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
    tableName: 'userincidents',
    timestamps: false
});