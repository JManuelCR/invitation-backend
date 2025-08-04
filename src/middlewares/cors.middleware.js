const cors = require('cors');

// Configuración de CORS para desarrollo
const developmentCorsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como aplicaciones móviles o Postman)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',     // React default
            'http://localhost:3001',     // React alternate
            'http://localhost:5173',     // Vite default
            'http://localhost:5174',     // Vite default
            'http://localhost:8080',     // Vue default
            'http://localhost:4200',     // Angular default
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:4200',
            'http://127.0.0.1:1000',     
            'https://invitation-nine-tan.vercel.app/' // vercel
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

// Configuración de CORS para producción (más restrictiva)
const productionCorsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// Middleware de CORS
const corsMiddleware = (req, res, next) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const corsOptions = isDevelopment ? developmentCorsOptions : productionCorsOptions;
    
    cors(corsOptions)(req, res, next);
};

module.exports = corsMiddleware; 