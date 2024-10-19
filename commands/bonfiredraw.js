const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bonfiredraw')
    .setDescription('Draw a card from my deck!'),
  async execute(interaction) {
    // Give bot a second to think.
    await interaction.deferReply();
    // Import the JSON file and pick a card index.
    const deck = require('../deck.json');
    const keys = Object.keys(deck);
    const cardIndex = Math.floor(Math.random() * keys.length);
    // Grab both parts of the chosen card.
    const cardKey = keys[cardIndex];
    const cardValue = deck[cardKey];
    //  Build and send the response.
    const response = `${cardKey}: ${cardValue}`;
    interaction.followUp(response);
  },
};