const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const path = require('path');

connectToMongo();
const app = express();
const port = process.env.PORT;
const client = process.env.CLIENT_URL;

if (process.env.DEV === 'true') {
  console.log('CORS enabled!');
  app.use(cors());
}
app.use(express.json());

// To serve static files
// Serve static files from root build folder
const rootBuildPath = path.join(__dirname, '../build');
app.use(express.static(rootBuildPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootBuildPath, 'index.html'));
  console.log('ParcelPro served!');
});

// ----------------------------------------------

// Available Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/contactus', require('./routes/contactus'));

// Trigger route
app.get('/api/trigger', (req, res) => {
  console.log('Trigger route accessed!');
  // Perform your action here
  res.json({ message: 'Trigger action performed successfully!' });
});

// Catch-all handler for any other route not explicitly handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(rootBuildPath, 'index.html'));
});

// main.js

app.listen(port, () => {
  console.log(`ParcelPro Apps listening at ${client}`);
});
