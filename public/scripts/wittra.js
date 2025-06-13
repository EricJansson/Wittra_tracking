const canvas = document.getElementById("wittraCanvas");
const canvasHeatmap = document.getElementById("wittraHeatmapCanvas");
const ctx = canvas.getContext("2d");
const ctxHeatmap = canvasHeatmap.getContext("2d");

var displayMode = "path"; // heatmap or path or both
var filteredItems = null;
var sensorData = [];
var deviceNeverMoved = null;
var selectedDeviceNumber = null;
MAP_X_OFFSET = 0; // Offset for the X-axis
MAP_Y_OFFSET = 0; // Offset for the Y-axis
DEFAULT_DEVICE_NUMBER = 35; // Default device number to filter by


const deviceIds = [
    { id: "D00124B00237B7DD1", number: 35 },
    { id: "D00124B00237B80D3", number: 28 },
    { id: "D00124B00237B81FB", number: 41 },
    { id: "D00124B00237B82BC", number: 27 },
    { id: "D00124B00237B82E4", number: 29 },
    { id: "D00124B00237B850D", number: 30 },
    { id: "D00124B00237B86B7", number: 34 },
    { id: "D00124B00237B89BB", number: 42 },
    { id: "D00124B00237B8AC3", number: 40 },
];


function filterDataByDeviceNumber(deviceNumber) {
    const deviceNumberInt = parseInt(deviceNumber);
    chosenDeviceId = deviceIds.find(device => device.number === deviceNumberInt)?.id;
    console.log("Selected device number:", deviceNumber);
    filteredItems = [];
    filteredItems = sensorData.filter(item => {
        return item.deviceId === chosenDeviceId && item.dataType === "location";
    });

    if (filteredItems.length > 1) {
        const firstLoc = filteredItems[0].location?.value;
        deviceNeverMoved = filteredItems.every(item =>
            item.location?.value.latitude === firstLoc.latitude &&
            item.location?.value.longitude === firstLoc.longitude
        );
    }

    if (filteredItems.length === 0) {
        console.warn("No data found for the selected device.");
        return;
    }
}


function drawFilteredDeviceData() {
    if (filteredItems === null) {
        console.log("No filtered items to draw. Please select a device first.");
        return
    }
    const select = document.getElementById("selectDeviceDropdown");
    const selectedNumber = select.value;
    console.log("Drawing for selected device number:", selectedNumber);
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNow();
}


var chosenDeviceId = deviceIds.find(device => device.number === DEFAULT_DEVICE_NUMBER)?.id;
const mapRotationDegrees = 39.2; // The building is rotated 39.2 degrees relative to its position on the earth to match the map orientation
const mapRotationRadians = mapRotationDegrees * Math.PI / 180;



// Longitude is the X-axis, Latitude is the Y-axis
const mapBounds = {
    minLat: 59.378199,   // bottom-left latitude
    maxLat: 59.378559,   // top-right latitude
    minLon: 16.5076,   // bottom-left longitude
    maxLon: 16.5083    // top-right longitude
};

function drawNow() {
    let counter = 0;
    const coordinates = [];

    // Step 1: Collect all coordinates
    filteredItems.forEach(item => {
        const loc = item.location;
        if (loc?.value.latitude && loc?.value.longitude) {
            const { x, y } = latLonToXY(loc.value.latitude, loc.value.longitude);
            if (x < 0 || x > canvas.width ||
                y < 0 || y > canvas.height) {
                console.log(`Coordinate out of bounds: (${x}, ${y})`);
            } else {
                coordinates.push({ x, y });
                counter++;
            }
        }
    });

    console.log("Coordinates to draw:");
    console.log(coordinates)

    // Reset canvas'
    displayDeviceStatusMessage();
    clearHeatmap();
    if (coordinates.length === 0) {
        console.log('No valid coordinates to draw. DeviceId:', chosenDeviceId);
        displayDeviceStatusMessage(`Couldn't find position data of device ${selectedDeviceNumber}.`);
        return;
    }
    if (deviceNeverMoved) { // If the device never moved, draw a single point
        displayDeviceStatusMessage(`Device never moved within this timeframe.`);
        drawCircleAt(coordinates[0].x, coordinates[0].y, 10, 'red');
    } else {
        drawPath(coordinates);
    }

    const heatData = processPointsForHeatmap(coordinates);
    drawHeatmap(heatData);

}


function drawPath(coordinates) {
    // Draw the path
    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i].x, coordinates[i].y);
    }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function displayDeviceStatusMessage(message = ` `) {
    const statusElement = document.getElementById('deviceStatusMessage');
    statusElement.textContent = message;
}

function rotatePoint(x, y, angle, originX, originY) {
    const dx = x - originX;
    const dy = y - originY;

    const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle) + originX;
    const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle) + originY;

    return { x: rotatedX, y: rotatedY };
}


function latLonToXY(lat, lon) {
    width = canvas.width;
    height = canvas.height;

    var x = (lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon) * (width - MAP_X_OFFSET * 2);
    var y = (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * (height - MAP_Y_OFFSET * 2);
    return { x, y };
}

function latLonToXY(lat, lon) {
    const width = canvas.width;
    const height = canvas.height;

    const x = (lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon) * (width - MAP_X_OFFSET * 2);
    const y = (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * (height - MAP_Y_OFFSET * 2);

    // Now rotate this point
    const originX = width / 2;
    const originY = height / 2;

    return rotatePoint(x, y, mapRotationRadians, originX, originY);
}

