import React from 'react';
import html2canvas from 'html2canvas';

const ARButton = () => {
  const openARCamera = async () => {
    // Step 1: Capture the screenshot of the webpage
    const screenshot = await captureScreenshot();

    // Step 2: Remove the background using Remove.bg API
    const processedImage = await removeBackground(screenshot);

    // Step 3: Open the AR window and overlay the processed image
    const arWindow = window.open("", "_blank", "width=800,height=600");

    if (!arWindow) {
      alert("Please allow pop-ups for this site to use AR features.");
      return;
    }
    

    arWindow.document.write(`
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              overflow: hidden; 
              font-family: Arial; 
              transform: scaleX(-1); /* Mirror flip the entire webpage */
            }
            #debug { 
              position: absolute; 
              top: 10px; 
              left: 10px; 
              color: white; 
              background: rgba(0,0,0,0.7); 
              padding: 10px; 
              z-index: 1000;
              transform: scaleX(-1); /* Reverse flip the debug text */
            }
            #video, #overlayCanvas { 
              position: absolute; 
              top: 0; 
              left: 0; 
              width: 100%; 
              height: 100%; 
            }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
        </head>
        <body>
          <div id="debug">Debug Info</div>
          <video id="video" autoplay playsinline></video>
          <canvas id="overlayCanvas"></canvas>
          <script>
            const debugElement = document.getElementById('debug');

            function log(message) {
              console.log(message);
              debugElement.innerHTML += message + '<br>';
            }

            let tshirtImage = null;

            // Load the processed image
            const processedImage = new Image();
            processedImage.src = "${processedImage}";
            processedImage.onload = () => {
              tshirtImage = processedImage;
              log("Processed image loaded successfully.");
            };

            // Setup camera
            async function setupCamera() {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  video: { facingMode: 'user' }
                });
                document.getElementById('video').srcObject = stream;
                return new Promise(resolve => {
                  document.getElementById('video').onloadedmetadata = () => {
                    document.getElementById('video').play();
                    resolve();
                  };
                });
              } catch (error) {
                console.error('Camera access error:', error);
                alert('Unable to access camera. Please check permissions.');
              }
            }

            // Start AR tracking
            async function startAR() {
              console.log("Starting AR...");
              const pose = new Pose({
                locateFile: (file) => \`https://cdn.jsdelivr.net/npm/@mediapipe/pose/\${file}\`
              });

              pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
              });

              pose.onResults(handlePoseResults);

              await setupCamera();
              const ctx = document.getElementById('overlayCanvas').getContext('2d');
              
              async function detectPose() {
                document.getElementById('overlayCanvas').width = document.getElementById('video').videoWidth;
                document.getElementById('overlayCanvas').height = document.getElementById('video').videoHeight;
                await pose.send({ image: document.getElementById('video') });
                requestAnimationFrame(detectPose);
              }

              function handlePoseResults(results) {
                ctx.clearRect(0, 0, document.getElementById('overlayCanvas').width, document.getElementById('overlayCanvas').height);
                
                if (results.poseLandmarks) {
                  const landmarks = results.poseLandmarks;

                  // Get shoulder, chest, and hip landmarks
                  const leftShoulder = landmarks[11];
                  const rightShoulder = landmarks[12];
                  const leftHip = landmarks[23];
                  const rightHip = landmarks[24];

                  // Calculate the width and height of the T-shirt area
                  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x) * document.getElementById('overlayCanvas').width;
                  const torsoHeight = Math.abs(leftShoulder.y - leftHip.y) * document.getElementById('overlayCanvas').height;

                  // Calculate the position of the T-shirt
                  const tshirtX = (leftShoulder.x + rightShoulder.x) / 2 * document.getElementById('overlayCanvas').width;
                  const tshirtY = leftShoulder.y * document.getElementById('overlayCanvas').height;

                  // Draw T-shirt image at the calculated position and size
                  if (tshirtImage) {
                    const tshirtWidth = shoulderWidth * 4.5; // Increase scaling factor for better fit
                    const tshirtHeight = torsoHeight * 1.8; // Increase scaling factor for better fit

                    // Adjust vertical offset to fit from neck to torso
                    const verticalOffset = tshirtHeight * 0.23; // Adjust this value as needed

                    ctx.drawImage(
                      tshirtImage, 
                      tshirtX - tshirtWidth / 2, // Center horizontally
                      tshirtY - verticalOffset, // Adjust vertical position
                      tshirtWidth, 
                      tshirtHeight
                    );
                  }
                }
              }

              detectPose();
            }

            startAR();
          </script>
        </body>
      </html>
    `);

    arWindow.document.close();
  };

  // Function to capture the screenshot of the webpage
  const captureScreenshot = async () => {
    const canvas = await html2canvas(document.body);
    return canvas.toDataURL('image/png');
  };

  // Function to remove the background using Remove.bg API
  const removeBackground = async (imageSrc) => {
    const formData = new FormData();
    formData.append("image_file", await fetch(imageSrc).then((res) => res.blob()));
    formData.append("size", "auto");
    console.log("KEY SENT:", JSON.stringify(import.meta.env.VITE_REMOVE_BG_API_KEY))

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": import.meta.env.VITE_REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      // This will read the actual error message from the Remove.bg server
      const errorText = await response.text(); 
      console.error("Remove.bg API Error Details:", errorText);
      throw new Error("Failed to remove background.");
    }

    const k = import.meta.env.VITE_REMOVE_BG_API_KEY;
    console.log("len:", k?.length, "start:", k?.slice(0, 4), "end:", k?.slice(-4));

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  return <button className='filtertabs-container-abc' onClick={openARCamera}>AR</button>;
};

export default ARButton;