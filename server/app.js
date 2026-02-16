import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './src/routes/users';

const app = express();

//========= MIDDLEWARE ==========
// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials:true
}));
// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Request Logging (simple version)
app.use((req, res, next) =>{
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


//========== ROUTES ============
app.use('/api/users', userRoutes);

app.get('/api/health', (req,res)=>{
  res.status(200).json({
    status:'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test endpoint (for Postman/development)
app.get('/api/test', (req,res)=>{
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on port ${PORT}`);
});   
