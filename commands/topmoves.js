import { embedLength, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { Chess } from 'chess.js';

export const data = new SlashCommandBuilder()
    .setName('topmoves')
    .setDescription('Shows the top moves by Stockfish for a given FEN position')
    .addStringOption(option =>
        option.setName('fen')
            .setDescription('The FEN string of the chess position')
            .setRequired(true));

export async function execute(interaction) {
    const fen = interaction.options.getString('fen');
    const lichessApiUrl = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=5`;
    const dynboardSettings = 'coordinates=outside&board=brown&piece=classic&size=3';

    try {
        const response = await fetch(lichessApiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch evaluation from Lichess API');
        }
        const data = await response.json();

        let topMoves = '';
        topMoves += data.pvs.map(pv => { 
            return formatTopMoves(pv.moves, fen);
        });
        topMoves = topMoves.replace(/,/g, "");

        const evaluation = data.pvs[0].cp / 100; // Convert centipawns to pawns
        const imageUrl = `https://chess.com/dynboard/?fen=${encodeURIComponent(fen)}%20-%20-%20-&${dynboardSettings}`;
       
        // Replace spaces with underscores to create a valid URL for lichess analysis
        const encodedFen = fen.replace(/ /g, '_');
        const url = `https://lichess.org/analysis/${encodedFen}`;

        await interaction.reply({
            embeds: [{
                title: `**Top Cloud Engine Moves:**`,
                description: `**[View on Lichess](${url})**\n\`\`\`${topMoves}\`\`\``,
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

export function formatTopMoves(topMoves, fen) {
  let chess = new Chess(fen);
  let fullMoveNumber = parseInt(fen.split(' ')[5], 10); // Extract the full move number from the FEN string
  let isWhiteTurn = chess.turn() === 'w';

  let moves = topMoves.split(' ');
  let algebraicMoves = moves.slice(0, 1).map((move, index) => {
    chess.move(move, { sloppy: true });

    let movePrefix;
    if (index === 0 && !isWhiteTurn) {
      movePrefix = `${fullMoveNumber}. ...`;
    } else if (isWhiteTurn) {
      movePrefix = `${index < fullMoveNumber ? index + fullMoveNumber : index + 1}. `;
    } else {
      movePrefix = '';
    }
    isWhiteTurn = !isWhiteTurn; // Toggle turn after each move
    return `${movePrefix} ${chess.history({ verbose: true }).pop().san}`;
  });
  chess.load(fen); // Reset the board to the original position
  return algebraicMoves.join('') + "\n";
}