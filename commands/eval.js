import { embedLength, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { Chess } from 'chess.js';

export const data = new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates the given FEN position using Lichess cloud eval and returns the cached evaluation score.')
    .addStringOption(option =>
        option.setName('fen')
            .setDescription('The FEN string of the chess position')
            .setRequired(true));

export async function execute(interaction) {
    const fen = interaction.options.getString('fen');
    const lichessApiUrl = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}`;
    const dynboardSettings = 'coordinates=outside&board=brown&piece=classic&size=3';

    try {
        const response = await fetch(lichessApiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch evaluation from Lichess API');
        }
        const data = await response.json();

        const evaluation = data.pvs[0].cp / 100; // Convert centipawns to pawns
        const imageUrl = `https://chess.com/dynboard/?fen=${encodeURIComponent(fen)}%20-%20-%20-&${dynboardSettings}`;
       
        // Replace spaces with underscores to create a valid URL for lichess analysis
        const encodedFen = fen.replace(/ /g, '_');
        const url = `https://lichess.org/analysis/${encodedFen}`;
        const turn = new Chess(fen).turn() === 'w' ? 'White to move' : 'Black to move';
        await interaction.reply({
            embeds: [{
                title: `**Position Evaluation:** ${evaluation} pawns`,
                description: `**[View on Lichess](${url})**\n\n${turn}`,
                image: { url: imageUrl },
                color: 692769
                }],
            ephemeral: false
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while evaluating the FEN position.', ephemeral: true });
    }
}