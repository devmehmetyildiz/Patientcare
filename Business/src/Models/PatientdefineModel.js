module.exports = sequelize.define('patientdefineModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    Firstname: {
        type: Sequelize.STRING
    },
    Lastname: {
        type: Sequelize.STRING
    },
    Fathername: {
        type: Sequelize.STRING
    },
    Mothername: {
        type: Sequelize.STRING
    },
    Motherbiologicalaffinity: {
        type: Sequelize.STRING
    },
    Ismotheralive: {
        type: Sequelize.BOOLEAN
    },
    Fatherbiologicalaffinity: {
        type: Sequelize.STRING
    },
    Isfatheralive: {
        type: Sequelize.BOOLEAN
    },
    CountryID: {
        type: Sequelize.STRING
    },
    Dateofbirth: {
        type: Sequelize.DATE
    },
    Placeofbirth: {
        type: Sequelize.STRING
    },
    Medicalboardreport: {
        type: Sequelize.STRING
    },
    Dependency: {
        type: Sequelize.STRING
    },
    Gender: {
        type: Sequelize.STRING
    },
    Marialstatus: {
        type: Sequelize.STRING
    },
    Criminalrecord: {
        type: Sequelize.STRING
    },
    Childnumber: {
        type: Sequelize.INTEGER
    },
    Disabledchildnumber: {
        type: Sequelize.INTEGER
    },
    Siblingstatus: {
        type: Sequelize.STRING
    },
    Sgkstatus: {
        type: Sequelize.STRING
    },
    Budgetstatus: {
        type: Sequelize.STRING
    },
    Town: {
        type: Sequelize.STRING
    },
    City: {
        type: Sequelize.STRING
    },
    Address1: {
        type: Sequelize.STRING
    },
    Address2: {
        type: Sequelize.STRING
    },
    Country: {
        type: Sequelize.STRING
    },
    Contactnumber1: {
        type: Sequelize.STRING
    },
    Contactnumber2: {
        type: Sequelize.STRING
    },
    Contactname1: {
        type: Sequelize.STRING
    },
    Contactname2: {
        type: Sequelize.STRING
    },
    CostumertypeID: {
        type: Sequelize.STRING
    },
    PatienttypeID: {
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
    tableName: 'patientdefines', // replace with the name of your existing table
    timestamps: false
});