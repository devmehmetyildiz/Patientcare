module.exports = sequelize.define('departmentModel', {
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

    Ishavepatients: {
        type: Sequelize.BOOLEAN
    },
    Isdefaultpatientdepartment: {
        type: Sequelize.BOOLEAN
    },
    Ishavepersonels: {
        type: Sequelize.BOOLEAN
    },
    Isdefaultpersoneldepartment: {
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
    tableName: 'departments', // replace with the name of your existing table
    timestamps: false
});