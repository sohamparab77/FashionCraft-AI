# FashionCraft AI 🛍✨

An AI-powered custom fashion design platform. Describe a design in plain text, generate a custom apparel texture with Stable Diffusion, preview it on an interactive 3D garment, and try it on in real time through your webcam.

## 🚀 Overview
FashionCraft AI bridges the gap between digital shopping and physical fitting rooms. By utilizing generative deep learning (Stable Diffusion) and real-time spatial image processing, this system allows users to generate custom apparel textures, view them in 3D, and virtually wear them using AR and body pose detection.

The pipeline also integrates the remove.bg API to seamlessly isolate the subject/garment from snapshots, ensuring clean texture mapping onto the 3D T-shirt model.

<img width="1919" height="1026" alt="image" src="https://github.com/user-attachments/assets/bc6e6ac8-e9d8-4433-a7f5-a7e7c5da4d52" />

<details>
<summary><strong>🔍 Click to expand and view output screenshots</strong></summary>
  <img width="1915" height="1017" alt="image" src="https://github.com/user-attachments/assets/16018ef1-5ec3-488d-82a1-842ad46be668" />
  <img width="1919" height="1046" alt="image" src="https://github.com/user-attachments/assets/a75504df-2a1a-408e-afe4-52edf46113f0" />
  <img width="1911" height="1004" alt="image" src="https://github.com/user-attachments/assets/4cf67786-85ec-47c3-afd9-275a1af3bd3b" />
  <img width="1916" height="1021" alt="image" src="https://github.com/user-attachments/assets/91ba32b6-a704-4cde-9abe-a14677719441" />
  <img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/125e894d-c6ca-40d1-9439-97148839e001" />
  <img width="1917" height="1079" alt="image" src="https://github.com/user-attachments/assets/d9c03f5e-a9bf-4223-aadc-a01b527281fc" />

</details>

## ✨ Core Features
* Prompt-Driven Design Generation: Type a text prompt and receive custom apparel textures from a locally hosted Stable Diffusion pipeline.
* Interactive 3D Preview: Real-time texture mapping onto a 3D garment model (Three.js) with full rotational control and inspection.
* Real-Time AR Virtual Try-On: Body landmark and pose tracking (MediaPipe & PoseNet) coupled with AR.js to overlay apparel onto live webcam video.
* Automated Background Removal: Background isolation for uploaded images and captured snapshots via the remove.bg API.
* Custom Uploads: Direct image and logo placement onto garment surfaces.
* User Accounts: Authentication flow for managing profile settings and saved configurations.

## 🛠️ Tech Stack
* Frontend: React.js, Three.js (3D garment rendering)
* Backend: Node.js, Express
* Generative AI: Stable Diffusion (AUTOMATIC1111 WebUI API)
* Computer Vision & AR: AR.js, MediaPipe, PoseNet
* Image Processing: remove.bg API

## ⚙️ Architecture Pipeline
1. User Input: User submits a design prompt or uploads a graphic via the React client.
2. Background Removal: Uploaded graphics are processed through the remove.bg API to isolate foreground textures.
3. Generative Inference: The Node.js server transmits parameters to the AUTOMATIC1111 API to synthesize the apparel texture.
4. 3D UV Mapping: The synthesized texture maps dynamically onto a Three.js 3D garment canvas.
5. AR Spatial Alignment: MediaPipe and PoseNet extract webcam skeletal landmarks, enabling AR.js to project the garment in real time.


## 💻 Local Setup

### Prerequisites
* Node.js (v16+) & npm
* Python 3.10.6 and Git (for Stable Diffusion WebUI)
* Compatible NVIDIA GPU with CUDA support
* Webcam for AR pose detection
* remove.bg API Key (available at https://www.remove.bg/api)

### 1. Stable Diffusion (AUTOMATIC1111) Setup
FashionCraft AI requires an active local instance of Stable Diffusion running in API mode.

Step A: Clone the WebUI Repository
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
  ```bash
    cd stable-diffusion-webui
 ```
Step B: Download SD 1.5 Weights
1. Navigate to the Hugging Face repository: https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5/tree/main
2. Download v1-5-pruned-emaonly.safetensors.
3. Move the file into the models/Stable-diffusion/ folder inside your stable-diffusion-webui directory.

Step C: Enable API Mode
* Windows: Edit webui-user.bat to include:
  ```bash
    set COMMANDLINE_ARGS= --api --xformers
  ```
* Linux/macOS: Edit webui-user.sh to include:
  ```bash
    export COMMANDLINE_ARGS="--api --xformers"
  ```
Step D: Launch the Engine
```bash
    ./webui-user.bat   (For Windows)
    ./webui.sh         (For Linux/macOS)
```
Wait until the terminal displays: Running on local URL: http://127.0.0.1:7860. Keep this window running.

### 2. Configure Environment Variables
Set up your client environment configuration:
```bash
    cd client
    touch .env
```
Add your API credentials inside client/.env:
```bash
  VITE_REMOVE_BG_API_KEY=your_api_key_here
```
### 3. Start Backend Server
From the backend directory, install packages and start the Node process:
```bash
    cd backend
    npm install
    npm start
```
### 4. Launch Frontend Client
Open a new terminal window, navigate to the frontend directory, and launch the dev server:
```bash
    cd client
    npm install
    npm run dev
```
Access the running application at http://localhost:3000 (or the local URL printed in your terminal).

## ⚠️ Limitations & Future Work
* Prototype Status: Fit and clothing alignment vary depending on user distance, camera angles, and ambient lighting.
* Hardware Dependency: Texture generation latency is bounded by local GPU VRAM and compute speed.
* Future Enhancements: Integration of ControlNet (OpenPose/Depth) for improved draping accuracy, physics-based fabric simulation, and containerized cloud deployment.
