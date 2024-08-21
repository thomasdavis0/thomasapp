const { App } = require('@slack/bolt');

// Loads environment variables from a .env file
require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to the slash command '/first-bolt'
app.command('/first-bolt', async ({ command, ack, respond }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Respond to the command with a message
    await respond(`Hello, <@${command.user_id}>! You just ran the /first-bolt command.`);
  } catch (error) {
    console.error('Error responding to the command:', error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
