module.exports = sequelize.define('fileModel', {
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
    Order: {
        type: Sequelize.INTEGER
    },
    ParentID: {
        type: Sequelize.STRING
    },
    Filename: {
        type: Sequelize.STRING
    },
    Filefolder: {
        type: Sequelize.STRING
    },
    Filepath: {
        type: Sequelize.STRING
    },
    Filetype: {
        type: Sequelize.STRING
    },
    Usagetype: {
        type: Sequelize.TEXT
    },
    Canteditfile: {
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
    tableName: 'files', // replace with the name of your existing table
    timestamps: false
});