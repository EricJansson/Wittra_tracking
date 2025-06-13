
var heatmap_blur = 25;
var heatmap_radius = 30;

function drawHeatmap(heatData) {
    const heat = simpleheat(canvasHeatmap);

    // Set the heat data
    heat.data(heatData);
    heat.radius(heatmap_radius, heatmap_blur); // (radius, blur)
    heat.max(1.0);       // maximum intensity
    heat.draw();
}

function clearHeatmap() {
    const ctx = canvasHeatmap.getContext('2d');
    ctx.clearRect(0, 0, canvasHeatmap.width, canvasHeatmap.height);
    drawHeatmap([]); // Redraw with empty data
}

function processPointsForHeatmap(rawPoints) {
    // Group and count duplicate points
    const pointMap = new Map();

    for (const p of rawPoints) {
        const key = `${Math.round(p.x)},${Math.round(p.y)}`; // round to avoid float noise
        pointMap.set(key, (pointMap.get(key) || 0) + 1);
    }

    // Convert map to array of [x, y, count]
    const heatData = Array.from(pointMap.entries()).map(([key, count]) => {
        const [x, y] = key.split(',').map(Number);
        return [x, y, count];
    });

    // Find max count for normalization
    const maxCount = Math.max(...heatData.map(p => p[2]));

    // Normalize intensity
    return heatData.map(([x, y, count]) => [x, y, count / maxCount]);
}


