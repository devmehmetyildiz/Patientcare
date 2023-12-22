import Realm from 'realm';

// Example usage
const realm = new Realm({
    schema: [
        {
            name: 'accessTokens',
            properties:
            {
                name: 'string',
                Accesstoken: 'string',
                Refreshtoken: 'string',
                ExpiresAt: 'date',
            }
        }],
});


export default realm