const LOCAL_FILE_NAME = '/data_files/wittraTestData.json';
const USE_TEST_DATA = true; // Set to true to force test data


function loadAndProcessData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Fetch failed');
            return response.json();
        })
        .then(data => {
            console.log("Total items loaded: " + data.length);
            sensorData = data;
            // Re-activate the select button
            document.getElementById('selectDeviceDropdown').disabled = false;
        });
}


function loadData() {
    if (USE_TEST_DATA) {
        console.log("Using test data");
        loadAndProcessData(LOCAL_FILE_NAME).catch(error => {
            console.error('Error loading test data:', error);
        });
    } else {
        console.log("Using API call");
        loadAndProcessData('/api/wittra-devices')
            .catch(error => {
                console.warn('API fetch failed, falling back to test data.');
                loadAndProcessData(LOCAL_FILE_NAME).catch(err => {
                    console.error('Fallback also failed:', err);
                });
            });
    }
}