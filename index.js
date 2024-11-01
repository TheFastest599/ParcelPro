const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const path = require('path');
// Will be used for remind me function
// const { Worker } = require('worker_threads');
// const worker = new Worker('./worker.js');

// // Console log on static files served
// const morgan = require('morgan');

connectToMongo();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));

// To serve static files
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
  console.log('My Notebook served!');
});

// ----------------------------------------------

// Available Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/contactus', require('./routes/contactus'));

// Trigger route
app.get('/api/trigger', (req, res) => {
  console.log('Trigger route accessed!');
  // Perform your action here
  res.json({ message: 'Trigger action performed successfully!' });
});

// Catch-all handler for any other route not explicitly handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// main.js

// Memory usage monitor
// setInterval(() => {
//   const memoryUsage = process.memoryUsage();
//   console.log(`RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
//   console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
//   console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
//   console.log(`External: ${memoryUsage.external / 1024 / 1024} MB`);
// }, 5000); // Print memory usage every 10 seconds
// // ----------------------------------------------

// Listen for messages from the worker thread
// worker.on('message', message => {
//   console.log('Message from worker script: ', message);
// });
// worker.postMessage('Main is on!');

app.listen(port, () => {
  console.log(`ParcelPro Apps listening at http://localhost:${port}`);
});
