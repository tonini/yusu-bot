import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('import')
  .setDescription('Imports a PGN game into Lichess and returns game information.')
  .addStringOption(option => 
    option.setName('pgn')
      .setDescription('The PGN of the chess game')
      .setRequired(true)
  );

export async function execute(interaction) {
  const pgn = interaction.options.getString('pgn');
  
  try {
    const response = await fetch('https://lichess.org/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: `pgn=${encodeURIComponent(pgn)}`
    });

    const data = await response.json();
    const gameUrl = data.url;
    if (!response.ok) {
      throw new Error(data.error || 'Failed to import PGN to Lichess');
    }
    const embed = {
      color: 0x0099ff,
      title: 'Lichess Game Import',
      description: 'Your game has been successfully imported to Lichess.',
      fields: [
        { name: 'Game URL', value: gameUrl },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Lichess Game Imported at'
      }
    };

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    await interaction.reply(`Error: ${error.message}`);
  }
}