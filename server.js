const express = require('express');
require('dotenv').config();

const app = express();
require('./db');

const adminRoute = require('./routes/admin');
const studentRoute = require('./routes/student');

app.use(express.json());

app.use('/admin', adminRoute);
app.use('/student', studentRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
