import { embedLength, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Displays statistics and most common moves for a given chess position')
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

        // Format the moves data
        const moves = formatMovesData(data);
        // Get the top 5 games
        const topGames = formatTopGames(data.topGames);

        await interaction.reply({
            embeds: [{
                title: `Opening Statistics`,
                description: `**Most Played Moves:**\n${moves}`,
                image: { url: imageUrl },
                fields: [
                    { name: 'Top 5 Games', value: topGames }
                ],
                color: 692769
                }],
            ephemeral: false
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while getting the opening statistics.', ephemeral: true });
    }
}


// helper function to format the moves data
function formatMovesData(data) {
    return data.moves.map(move => {
        const totalGames = move.white + move.draws + move.black;
        const winRate = (move.white * 100 / totalGames).toFixed(2);
        const drawRate = (move.draws * 100 / totalGames).toFixed(2);
        const loseRate = (move.black * 100 / totalGames).toFixed(2);
        return `> **${move.san}:** ${winRate}% W, ${drawRate}% D, ${loseRate}% L (${totalGames} games)`;
    }).join('\n');
}

// helper function to format the top games data
function formatTopGames(topGames) {
    return topGames.slice(0, 5).map(game => {
        const url = `https://lichess.org/${game.id}`;
        return `[${game.white.name} vs ${game.black.name}](${url})`;
      }).join('\n');
}