require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(express.json());

app.get('/',(req,res)=>{
   res.send("API is running...");
})

app.use('/api/auth', require('./routes/auth'));
app.use('/api/polls', require('./routes/polls'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));