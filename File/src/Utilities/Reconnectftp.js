const config = require("../Config")

module.exports = async () => {
    try {

        const server = {
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password
        };

        if (client.closed) {
            // Eğer bağlantı kapalıysa tekrar bağlantı sağla
            await client.access(server);
            console.log('Ftp synced successfully again.');
        } else {
            await client.close()
            console.log('Ftp connection already closed.');
        }
    } catch (error) {
        console.log('Ftp cant synced again: ', error);
    }
}