const express = require('express')
const path = require('path')
const hbs = require('hbs')
const dotenv = require('dotenv')
const getWittraDevices = require('./utils/wittraDevices');


// load config
dotenv.config({ path: './config/config.env' })

const app = express();
const port = process.env.PORT || 5000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))
app.use(express.json()); // For parsing application/json


app.get('', (req, res) => {
    res.render('index', {
        title: 'Wittra tracking',
        errormessage: null
    });
})

app.get('/api/wittra-devices', (req, res) => {
    getWittraDevices((error, data) => {
        if (error) {
            return res.status(500).json({ error: 'Could not load devices' });
        }
        res.json(data.devices); // Send devices directly
    });
});


if (port != 443) {
    // Use app.listen for other ports
    app.listen(port, () => {
        console.log('HTTP Server running on port:', port);
    });
}

