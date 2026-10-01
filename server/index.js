import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import sdRoutes from './routes/sd.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

app.use('/api/v1/sd', sdRoutes); 
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from FashionCraft AI (Stable Diffusion)' });
});

app.listen(8080, () => console.log('Server has started on port 8080'));
