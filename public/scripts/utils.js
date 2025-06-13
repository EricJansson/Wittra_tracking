// Util functions for programming

function drawCircleAt(x, y, radius, color = 'green') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}


function drawOffsetRectangle(offset_x_min, offset_y_min, offset_x_max, offset_y_max) {
    const x = offset_x_min;
    const y = offset_y_min;
    const width = canvas.width - offset_x_min - offset_x_max;
    const height = canvas.height - offset_y_min - offset_y_max;

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCircleAtLatLon(lat, lon, radius, color = 'green') {
    const { x, y } = latLonToXY(lat, lon);
    console.log(`Drawing circle at lat: ${lat}, lon: ${lon} -> `);
    console.log(`x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`);
    drawCircleAt(x, y, radius, color);
}

// tag 24
tag_x = 16.507891901491178
tag_y = 59.37827790848101

// tag 17
tag_x2 = 16.508291716642645
tag_y2 = 59.37840075445641

// tag 18
tag_x3 = 16.507991661794335
tag_y3 = 59.37847561160592

/*
setTimeout(() => {
    console.log("Drawing circle at tag location");
    drawCircleAtLatLon(tag_y, tag_x, 10);
    drawCircleAtLatLon(tag_y2, tag_x2, 10, 'red');
    drawCircleAtLatLon(tag_y3, tag_x3, 10, 'yellow');
}, 500);
*/


// drawOffsetRectangle(50, 50, 50, 50);