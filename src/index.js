const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const fastcsv = require('fast-csv');

const {find, create} = require('./adapters/postgres')
//routes
const auth = require('./route/auth')
const users = require('./route/user');
const { sendEmailNotification } = require('./adapters/email');

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());




// WebSocket connection handling
wss.on('connection', async (ws) => {
    // Fetch existing messages from the database and send to the new client
    let messages = await find('messages')
    messages.forEach((row) => {
        ws.send(JSON.stringify(row));
        });

    // Listen for messages from WebSocket clients
    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
  
        // Save the message to the database
        message = await update('messages',{sender:parsedMessage.sender, content: parsedMessage.content})
        
        // Broadcast the new message to all connected WebSocket clients
        wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message[0]));
        }
        });
    });
  });
  
  // Endpoint for sending messages
  app.post('/api/messages', async(req, res) => {
    const { sender, content } = req.body;
  
    if (!sender || !content) {
      return res.status(400).json({ error: 'Sender and content are required' });
    }
  
    // Save the message to the database
    const message = await create('messages',{sender, content})

    // Broadcast the new message to all connected WebSocket clients
    wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message[0]));
    }
    });
    
    // Respond with the new message
    res.status(201).json(message[0]);
  });

// Endpoint for sending messages
app.post('/api/tasks', async(req, res) => {
    const { title, description, assigned_to } = req.body;
    try {
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        // Save the message to the database
        const newTask = await create('tasks',{ title, description, assigned_to })
        
        // Broadcast the new task to all connected WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(newTask));
            }
          });
      
        // Send email notification
        sendEmailNotification(newTask[0]);
    
        // Respond with the new task
        res.status(201).json(newTask);
    } catch (error) {
        console.log(error)
    }
});

// Endpoint to export tasks to CSV
app.get('/api/export/tasks', async (req, res) => {
    try {
        const rows = await find('tasks',{});
    
        const csvData = [];
    
        // Transform rows into an array suitable for CSV export
        rows.forEach((row) => {
          csvData.push(Object.values(row));
        });
    
        const ws = fs.createWriteStream('./src/public/tasks.csv');
    
        fastcsv.write(csvData, { headers: true })
        .pipe(ws)
        .on('finish', () => {
          // Set response headers for CSV download
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
  
          // Send the file as part of the response
          res.sendFile('./public/tasks.csv', { root: __dirname }, (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              // Cleanup: Delete the temporary CSV file after sending
              fs.unlinkSync('./src/public/tasks.csv');
            }
          });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

// Endpoint to import tasks from CSV
// app.post('/api/import/tasks', async (req, res) => {
//     try {
//       if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).json({ error: 'No files were uploaded.' });
//       }
  
//       const file = req.files.file;
//       const tasks = [];
  
//       fastcsv.parseString(file.data.toString(), { headers: true })
//         .on('data', (row) => {
//           tasks.push(row);
//         })
//         .on('end', async () => {
//           await pool.query('DELETE FROM tasks'); // Clear existing tasks
//           const query = fastcsv.format({ headers: true }).transform(tasks);
//           query.pipe(fs.createWriteStream('tasks.csv'));
//           res.status(200).json({ message: 'Import successful' });
//         });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

app.use('/api/auth',auth);
app.use('/api/users',users);


  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
