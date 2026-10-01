import * as dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// URL for the Automatic1111 API
const AUTOMATIC1111_API_URL = 'http://127.0.0.1:7860/sdapi/v1/txt2img';

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body; // Get prompt from the request body

        const response = await axios.post(AUTOMATIC1111_API_URL, {
            prompt,
            n: 1, // Number of images
            size: '1024x1024',
            steps: 20, // Number of steps for generation
        });

        const image = response.data.images[0]; // The generated image in base64 format
        res.status(200).json({ photo: image }); // Send back the image to the frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

export default router;
    