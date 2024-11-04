import { SlashCommandBuilder } from 'discord.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of all available commands and their usage');

export async function execute(interaction) {
    const commands = [
        {
            name: '/eval',
            description: 'Evaluates the given FEN position using Lichess cloud eval and returns the cached evaluation score, if available.',
        },
        {
            name: '/import',
            description: 'Imports a PGN game into Lichess and returns game information.',
        },
        {
            name: '/topmoves',
            description: 'Displays the top moves evaluated by Lichess cloud eval for a given FEN position',
        },
        {
            name: '/topgames',
            description: 'Displays the top games for a given FEN position',
        },
        {
            name: '/stats',
            description: 'Displays statistics and most common moves for a given chess position',
        },
        {
          name: 'Version:',
          description: `${config.version}`,
      }
    ];

    const embed = {
        title: 'Commands For Yusu-Bot',
        description: 'Here is a list of all available commands and their usage:',
        color: 692769,
        fields: commands.map(command => ({
            name: '',
            value: `**${command.name}** ${command.description}\n`
        }))
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
}