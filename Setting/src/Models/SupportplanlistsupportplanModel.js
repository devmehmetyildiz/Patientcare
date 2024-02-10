module.exports = sequelize.define('supportplanlistsupportplanModel', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ListID: {
        type: Sequelize.STRING
    },
    PlanID: {
        type: Sequelize.STRING
    }
}, {
    tableName: 'supportplanlistsupportplans', // replace with the name of your existing table
    timestamps: false
});