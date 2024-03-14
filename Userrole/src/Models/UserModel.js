module.exports = sequelize.define('userModel', {

    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Username: {
        type: Sequelize.STRING
    },
    Name: {
        type: Sequelize.STRING
    },
    Surname: {
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING
    },
    EmailConfirmed: {
        type: Sequelize.BOOLEAN
    },
    PasswordHash: {
        type: Sequelize.STRING
    },
    AccessFailedCount: {
        type: Sequelize.INTEGER
    },
    Language: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.INTEGER
    },
    Config: {
        type: Sequelize.TEXT
    },
    Defaultdepartment: {
        type: Sequelize.STRING
    },
    Defaultpage: {
        type: Sequelize.STRING
    },
    ProfessionID: {
        type: Sequelize.STRING
    },
    Includeshift: {
        type: Sequelize.BOOLEAN
    },
    CountryID: {
        type: Sequelize.STRING
    },
    Workstarttime: {
        type: Sequelize.DATE
    },
    Workendtime: {
        type: Sequelize.DATE
    },
    Gender: {
        type: Sequelize.STRING
    },
    Adress: {
        type: Sequelize.TEXT
    },
    Phonenumber: {
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
    tableName: 'users',
    timestamps: false
});