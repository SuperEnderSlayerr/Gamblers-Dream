// This bot is Tyler's commission from Ender.

const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const keepAlive = require('./server.js');
const path = require('node:path');
const token = process.env['TOKEN']

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// Builds an array containing every file name that ends in .js in the commands folder.
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Loops through the commandFiles array to put each command into the client.commands Collection.
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module.
  // Also makes sure each command has the data and execute properties.
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Shoves all the event files into an array.
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Puts all the events into the client, but just runs the init ones.
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Launches the bot and keeps it up.
keepAlive();
client.login(token);
