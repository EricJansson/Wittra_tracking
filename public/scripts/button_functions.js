function toggleMapBackground() {
    const toggleButton = document.getElementById('toggleTagsButton');
    const taggedMapElement = document.getElementById('wittraMapTagged');

    if (toggleButton.value === '1') {
        taggedMapElement.style.opacity = 1;
        toggleButton.value = '2';
    } else {
        taggedMapElement.style.opacity = 0;
        toggleButton.value = '1';
    }
}


function populateDeviceSelect() {
    const select = document.getElementById("selectDeviceDropdown");

    // Populate the select element
    for (let i = 0; i < deviceIds.length; i++) {
        const number = deviceIds[i].number;
        const option = document.createElement("option");
        option.value = number;
        option.textContent = "Device " + number;
        select.appendChild(option);
    }

    // Handle change event
    select.addEventListener("change", function () {
        selectedDeviceNumber = this.value;
        filterDataByDeviceNumber(selectedDeviceNumber);
        // Draw the map with the filtered items
        drawFilteredDeviceData();
    });
}

function populateDisplayModeSelect() {
    const select = document.getElementById("selectDisplayModeDropdown");
    select.addEventListener("change", function () {
        displayMode = this.value;

        canvas.style.opacity = 0;
        canvasHeatmap.style.opacity = 0;
        if (displayMode === "heatmap") {
            canvasHeatmap.style.opacity = 1;
        } else if (displayMode === "path") {
            canvas.style.opacity = 1;
        } else {
            canvasHeatmap.style.opacity = 1;
            canvas.style.opacity = 1;
        }
        console.log("Display mode changed to:", displayMode);
        drawFilteredDeviceData();
    });
}

document.getElementById('toggleTagsButton').addEventListener('click', toggleMapBackground);