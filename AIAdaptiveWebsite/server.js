// npm install express axios
let path = require('path');
let express = require('express');
let axios = require('axios');
let app = express();
let port = 3000; // Choose an appropriate port number
let { Configuration, OpenAIApi } = require("openai");
let OPENAI_API_KEY = 'key'
let configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
let openai = new OpenAIApi(configuration);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON requests
app.use(express.json());

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint for handling the 'Language Barrirer' option
app.post('/language-barrier', async (req, res) => {
  console.log('in controller')

  try {
    let htmlCode = req.body.htmlCode;
    // get json file
    const fs = require('fs');
    let jsonData = fs.readFileSync('user.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return data;
      }
    });
    if (!htmlCode) {
      return res.status(400).json({ error: 'Incomplete code data received.' });
    }
    // Combine the HTML and JSon into one text for ChatGPT
    let combinedCode = `\n${htmlCode}` + jsonData;
    // Make a request to ChatGPT API to get the modified code
    let response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `You have been given an HTML code and a JSON text containing user profile.
      Your goal is to analyze the JSON text and choose the appropriate option/options from the two options:
      1. The "education" specified in the user profile shows that the user has a lower education level than a university degree. Rewrite the text of the webpage, which is within the <p> tags to make it easier for the user to understand. 
      2. The "language" specified in the user profile is not "English" and some other language. Translate all the content within all the tag elements to the specified language in the user profile.
      Make the necessary changes to the provided HTML and return only the new file\n\n${combinedCode}` }],
    });

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      let modifiedCode = response.data.choices[0].message.content;
      // Send the modified code back to the client
      res.json({ modifiedCode });
    } else {
      console.error('Invalid API response: No message content found.');
      res.status(500).json({ error: 'An error occurred while highlighting the searched option.' });
    }
  } catch (error) {
    console.error('Error highlighting the searched option:', error.message);
    res.status(500).json({ error: 'An error occurred while highlighting the searched option.' });
  }
});

// Endpoint for handling the 'I am looking for...' option
app.post('/search-option', async (req, res) => {
  console.log('in controller')
  let htmlCode = req.body.htmlCode;
  let option = req.body.option;

  if (!htmlCode || !option) {
    return res.status(400).json({ error: 'Incomplete code data received.' });
  }

  try {
    // Combine the HTML, CSS, and JS code into one text for ChatGPT
    let combinedCode = `\n${htmlCode}`;
    // Make a request to ChatGPT API to get the modified code
    let response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `You have been given an HTML code and your task is to use inline styling to Highlight the option '${option}' within the code. 
      Change the background color, add a border, and alter the text color. Apply the inline styles directly 
      to the HTML element, and make it stand out using your highlighting effect. Return only the new file\n\n${combinedCode}` }],
    });

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      let modifiedCode = response.data.choices[0].message.content;
      // Send the modified code back to the client
      res.json({ modifiedCode });
    } else {
      console.error('Invalid API response: No message content found.');
      res.status(500).json({ error: 'An error occurred while highlighting the searched option.' });
    }
  } catch (error) {
    console.error('Error highlighting the searched option:', error.message);
    res.status(500).json({ error: 'An error occurred while highlighting the searched option.' });
  }
});

// Endpoint for improving webpage visibility
app.post('/improve-visibility', async (req, res) => {
  console.log('in controller')
  let htmlCode = req.body.htmlCode;
  let cssCode = req.body.cssCode;
  let jsCode = req.body.jsCode;
  if (!htmlCode || !cssCode || !jsCode) {
    return res.status(400).json({ error: 'Incomplete code data received.' });
  }
  try {
    // Combine the HTML, CSS, and JS code into one text for ChatGPT
    let combinedCode = `\n<style>${cssCode}</style>`;
    // Make a request to ChatGPT API to get the modified code
    let response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Your goal is to analyze the provided CSS code and choose the best option/options to improve the visibility of the webpage. You have three primary options to choose from:
      1. Increase Font Size: Enlarge the font size of the text to enhance readability for users, especially those with visual impairments or viewing the website on small screens.
      2. Enhance Contrast: Adjust the color contrast between text and background to ensure better readability. The text should stand out clearly against the background.
      3. Optimize Line Spacing and Padding: Increase the line-height property to provide better spacing between lines of text, making the content easier to read. Add appropriate padding around content elements to give them more space and improve overall readability.
      Do not include any explanation in your response. Make the necessary changes to the provided CSS code and return only the new file\n\n${combinedCode}` }],
    });

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      let modifiedCode = response.data.choices[0].message.content;
      // Send the modified code back to the client
      res.json({ modifiedCode });
    } else {
      console.error('Invalid API response: No message content found.');
      res.status(500).json({ error: 'An error occurred while improving webpage visibility.' });
    }
  } catch (error) {
    console.error('Error improving webpage visibility:', error.message);
    res.status(500).json({ error: 'An error occurred while improving webpage visibility.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
