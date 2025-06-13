const request = require('request');

const getWittraDevices = (callback) => {
    const apiKey = process.env.WITTRA_API;
    const org_id = process.env.ORG_ID
    const project_id = process.env.PROJECT_ID

    if (!org_id || !apiKey) {
        return callback('Missing API credentials.', undefined);
    }

    const base64Auth = Buffer.from(`${org_id}:${apiKey}`).toString('base64');
    const url = `https://api.wittra.se/v1/organizations/${org_id}/projects/${project_id}/data`;

    const options = {
        url,
        headers: {
            'Authorization': `Basic ${base64Auth}`
        },
        json: true
    };

    request(options, (error, { body } = {}) => {
        if (error) {
            console.log("WITTRA: Network error");
            callback('Unable to connect to Wittra API.', undefined);
        } else if (!body || Object.keys(body).length === 0) {
            console.log("WITTRA: Empty response");
            callback('No data received from Wittra.', undefined);
        } else {
            // Optional: parse or filter body here
            callback(undefined, {
                devices: body
            });
        }
    });
};

module.exports = getWittraDevices;
