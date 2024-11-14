const express = require('express');
const axios = require('axios');
const app = express();
const port = 2384;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve a basic HTML form for email input
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <label for="email">Enter Email: </label>
      <input type="email" id="email" name="email" required />
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission and make the request to the external API
app.post('/submit', async (req, res) => {
  const { email } = req.body;

  // Ensure the email is provided
  if (!email) {
    return res.status(400).send('Email is required!');
  }

  const url = 'https://api.textnow.me/api2.0/users/suggestions?client_type=TN_IOS_FREE&idfa=&idfv=220D87EF-D245-48CE-850E-398E358D4BAA';
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'TextNow/24.45.0 (iPhone10,6; iOS 17.0.2; Scale/3.00)',
    'X-TN-Integrity-Session': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfdHlwZSI6IlROX0lPU19GUkVFIiwiZGV2aWNlX2F0dGVzdGVkIjp0cnVlLCJkZXZpY2VfY2hlY2tfYXR0ZXN0ZWQiOnRydWUsImV4cCI6MTczMTY0ODY1MCwiaWF0IjoxNzMxNDc1ODUwLCJpc3MiOiJ0bi1pbnRlZ3JpdHktc2VydmljZSIsInN1YiI6InRuLWludGVncml0eS1zZXNzaW9uIn0.Ub1bcGUykcBnq_J9rO7Pb5Dj5-bepvIgJ0vTSjNE-Q8',
    'x-emb-id': '06BD19738BAA4CD38FD32520A1BF1FE4',
    'x-emb-path': '/api2.0/users/maskedForPrivacy',
    'x-emb-st': '1731565255524'
  };

  const body = {
    base_names: [email]
  };

  try {
    // Make the POST request to the external API
    const response = await axios.post(url, body, { headers });

    // Show the response data to the user
    res.send(`
      <h3>API Response for ${email}:</h3>
      <pre>${JSON.stringify(response.data, null, 2)}</pre>
      <a href="/">Go Back</a>
    `);
  } catch (error) {
    // Handle errors and show them to the user
    console.error('Error making API request:', error);
    res.status(500).send('Error making API request. Please try again later.');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
