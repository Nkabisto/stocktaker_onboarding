import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

//========= MIDDLEWARE ==========
// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http:/localhost:3000',
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
app.get('/api/health', (req,res)=>{
  res.status(200).json({
    status:'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test endpoint (for Postman/development)

