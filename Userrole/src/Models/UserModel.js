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
    PasswordHash: {
        type: Sequelize.STRING
    },

    Language: {
        type: Sequelize.STRING
    },
    Config: {
        type: Sequelize.TEXT
    },
    Defaultpage: {
        type: Sequelize.STRING
    },
    Isworker: {
        type: Sequelize.BOOLEAN
    },

    Workstarttime: {
        type: Sequelize.DATE
    },
    Workendtime: {
        type: Sequelize.DATE
    },
    
    Leftinfo:{
        type: Sequelize.TEXT
    },

    CaseID: {
        type: Sequelize.STRING
    },
    Isworking: {
        type: Sequelize.BOOLEAN
    },
    ShiftdefineID: {
        type: Sequelize.STRING
    },

    ProfessionID: {
        type: Sequelize.STRING
    },
    Includeshift: {
        type: Sequelize.BOOLEAN
    },

    Dateofbirth: {
        type: Sequelize.DATE
    },
    Phonenumber: {
        type: Sequelize.STRING
    },
    Bloodgroup: {
        type: Sequelize.STRING
    },
    Foreignlanguage: {
        type: Sequelize.STRING
    },
    Graduation: {
        type: Sequelize.STRING
    },
    Contactnumber: {
        type: Sequelize.STRING
    },
    Chronicillness: {
        type: Sequelize.STRING
    },
    Covid: {
        type: Sequelize.STRING
    },
    City: {
        type: Sequelize.TEXT
    },
    Town: {
        type: Sequelize.TEXT
    },
    Adress: {
        type: Sequelize.TEXT
    },
    CountryID: {
        type: Sequelize.STRING
    },
    Gender: {
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