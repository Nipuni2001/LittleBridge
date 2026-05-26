const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173','http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.use(express.json({ limit:'30mb' }));
app.use(express.urlencoded({ extended:true, limit:'30mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => res.json({ status:'OK', time:new Date().toISOString() }));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/orphanages',    require('./routes/orphanages'));
app.use('/api/adoptions',     require('./routes/adoptions'));
app.use('/api/sponsorships',  require('./routes/sponsorships'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/admin',         require('./routes/admin'));        // NEW

app.use((req, res) => res.status(404).json({ success:false, message:`Not found: ${req.method} ${req.path}` }));
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success:false, message:'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n LittleBridge backend on port ${PORT}`);
  console.log(`   DB: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
});

module.exports = app;
