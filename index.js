const express = require('express');
const bodyParser = require('body-parser');

//Routings
const authHeaderRoutes = require('./routes/authHeaderRoute');
const authHeaderValidationRoutes = require('./routes/authHeaderValidationRoute');

//Create Express App
const app = express();
const ports = process.env.PORT || 5000;

//create middleware
app.use(bodyParser.json());

//CORS - allow access to different pages (express-angular)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/bi/openapi/auth-header', authHeaderRoutes);
app.use('/bi/openapi/auth-header-validation', authHeaderValidationRoutes);

//listen to the port
app.listen(ports, () => console.log(`Listening on port ${ports}`));