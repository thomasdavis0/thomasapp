require('dotenv').config();

const { App, ExpressReceiver } = require('@slack/bolt');
const express = require('express');
const path = require('path');

// Initialize your own ExpressReceiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  scopes: ['commands', 'chat:write', 'app_mentions:read', 'channels:history'],
  installerOptions: {
    redirectUriPath: '/slack/oauth_redirect',
    directInstall: true,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      // Add logic here to store the installation details securely
      console.log('Installation stored:', installation);
      // Save installation data in your database or another storage mechanism
    },
    fetchInstallation: async (installQuery) => {
      // Fetch the installation details using the installQuery object
      console.log('Installation fetched:', installQuery);
      // Retrieve installation data from your database or another storage mechanism
    },
  },
});

const app = new App({
  receiver: receiver,
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  console.log('hello');
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

// Static files route for OAuth
receiver.app.use('/static', express.static(path.join(__dirname, 'public')));

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
