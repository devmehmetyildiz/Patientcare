module.exports = sequelize.define('surveydetailModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },
    
    Order: {
        type: Sequelize.INTEGER
    },
    SurveyID: {
        type: Sequelize.STRING
    },
    Question: {
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
    tableName: 'surveydetails', // replace with the name of your existing table
    timestamps: false
});