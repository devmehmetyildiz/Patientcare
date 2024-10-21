module.exports = sequelize.define('surveyresultModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Uuid: {
        type: Sequelize.STRING
    },

    SurveyID: {
        type: Sequelize.STRING
    },
    SurveydetailID: {
        type: Sequelize.STRING
    },
    UserID: {
        type: Sequelize.STRING
    },
    User: {
        type: Sequelize.STRING
    },

    Answer: {
        type: Sequelize.INTEGER
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
    tableName: 'surveyresults', // replace with the name of your existing table
    timestamps: false
});