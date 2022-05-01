const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//----Middleware---
app.use(cors());
app.use(express.json());













app.get('/', (req, res) => {
    res.send('Vaccine giving')
})

app.listen(port, () => {
    console.log('running port', port)
})





