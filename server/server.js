const express=require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
dotenv.config();
const route=require('./routes/index')
const app=express()

app.use(cors())
app.use(express.json())

connectDB();
route(app);
app.get('/', (req, res) => {
    res.send('Server đang chạy...');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));