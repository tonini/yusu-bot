import { embedLength, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
    .setName('topgames')
    .setDescription('Displays the top games for a given FEN position')
    .addStringOption(option =>
        option.setName('fen')
            .setDescription('The FEN string of the chess position')
            .setRequired(true));

export async function execute(interaction) {
    const fen = interaction.options.getString('fen');
    const lichessApiUrl = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`;
    const dynboardSettings = 'coordinates=outside&board=brown&piece=classic&size=3';

    try {
      const response = await fetch(lichessApiUrl);

      if (!response.ok) {
          throw new Error('Failed to fetch master games from Lichess API');
      }
      const data = await response.json();

      const imageUrl = `https://chess.com/dynboard/?fen=${encodeURIComponent(fen)}%20-%20-%20-&${dynboardSettings}`;
     
      // Replace spaces with underscores to create a valid URL for lichess analysis
      const encodedFen = fen.replace(/ /g, '_');
      const url = `https://lichess.org/analysis/${encodedFen}`;

      const topGames = formatTopGames(data.topGames);

      await interaction.reply({
          embeds: [{
              title: `Top Games`,
              description: `**The 15 top games played from the given position:**`,
              image: { url: imageUrl },
              fields: [
                  { name: 'Top 15 Games', value: topGames }
              ],
              color: 692769
              }],
          ephemeral: false
      });
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while getting the top games.', ephemeral: true });
  }
}

// helper function to format the top games data
function formatTopGames(topGames) {
  return topGames.slice(0, 15).map(game => {
      const url = `https://lichess.org/${game.id}`;
      return `[${game.white.name} vs ${game.black.name}](${url})`;
    }).join('\n');
}