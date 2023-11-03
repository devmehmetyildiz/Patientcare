const config = require("../Config")

module.exports = async () => {
    try {

        const server = {
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password
        };

        await client.close
        await client.access(server)
        console.log('Ftp synced successfully again.');
    } catch (error) {
        console.log('Ftp cant synced again: ', error);
    }
}