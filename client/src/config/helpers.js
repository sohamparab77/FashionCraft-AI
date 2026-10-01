import html2canvas from 'html2canvas';

export const getScreenshot = tabName => {
    console.log("getScreenshot function called with tabName:", tabName);

    switch (tabName) {
        case 'download':
            console.log("Attempting to capture screenshot...");

            // Select the element to capture
            const captureElement = document.querySelector('.capture');
            console.log("Selected capture element:", captureElement);

            // Check if the element exists
            if (!captureElement) {
                console.error("Element with class '.capture' not found.");
                return;
            }

            // Generate a unique filename
            const date = Math.floor(Date.now() / 100);
            console.log("Generated filename timestamp:", date);

            // Use html2canvas to capture the element
            html2canvas(captureElement, {
                useCORS: true, // Enable cross-origin images
                logging: true, // Enable logging for debugging
                scale: 2, // Increase resolution for better quality
            })
                .then(canvas => {
                    console.log("Canvas created successfully:", canvas);

                    // Convert canvas to image
                    const image = canvas.toDataURL('image/png');
                    console.log("Image data URL generated:", image);

                    // Create a download link
                    const a = document.createElement('a');
                    a.setAttribute('download', `my-tshirt-design-${date}.png`);
                    a.setAttribute('href', image);

                    // Trigger the download
                    a.click();
                    console.log("Screenshot captured and downloaded successfully.");
                })
                .catch(error => {
                    console.error("Failed to capture screenshot:", error);
                });
            break;

        default:
            console.warn(`Unsupported tab name: ${tabName}`);
            break;
    }
};

export const reader = file =>
	new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = () => resolve(fileReader.result);
		fileReader.readAsDataURL(file);
	});

export const getContrastingColor = color => {
	// Remove the '#' character if it exists
	const hex = color.replace('#', '');

	// Convert the hex string to RGB values
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// Calculate the brightness of the color
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// Return black or white depending on the brightness
	return brightness > 128 ? 'black' : 'white';
};

export const displayLoading = () => {
	const loader = document.querySelector('#loading');
	const aipickerButtons = document.querySelectorAll('.aipicker-buttons');
	const aipickerTextArea = document.querySelector('.aipicker-textarea');

	loader.classList.add('display');
	aipickerButtons.forEach(button => {
		button.classList.add('disabled');
		button.setAttribute('disabled', '');
	});
	aipickerTextArea.setAttribute('disabled', '');
};

export const hideLoading = () => {
	const loader = document.querySelector('#loading');
	const aipickerButtons = document.querySelectorAll('.aipicker-buttons');
	const aipickerTextArea = document.querySelector('.aipicker-textarea');

	loader.classList.remove('display');
	aipickerButtons.forEach(button => {
		button.classList.remove('disabled');
		button.removeAttribute('disabled');
	});
	aipickerTextArea.removeAttribute('disabled');
};

export const iOSFix = () => {
	const isTablet =
		/^iP/.test(navigator.userAgent) ||
		(/^Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
	if (isTablet) {
		document.querySelector('.forIOS').classList.add('iOS');
	}
};
