require('dotenv').config();
const { App } = require('@slack/bolt');
const express = require('express');
const axios = require('axios');

// Initialize the Slack Bolt App
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Slack message handling
slackApp.message('hello', async ({ message, say }) => {
  console.log('Received hello');
  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>!`
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });
});

// Initialize an Express application
const app = express();

// Route to handle OAuth redirect
app.get('/oauth_redirect', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: 'YOUR_REDIRECT_URI'
      }
    });
    if (response.data.ok) {
      res.send('App installed successfully!');
    } else {
      res.send('Failed to install the app.');
    }
  } catch (error) {
    console.error('Failed to exchange the OAuth code:', error);
    res.status(500).send('Server Error');
  }
});

// Start both the Slack and Express apps
(async () => {
  // Start your Slack app
  await slackApp.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
  // Start Express server on the same port
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running!');
  });
})();
