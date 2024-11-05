import { SlashCommandBuilder } from 'discord.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
    .setName('commandments')
    .setDescription("Displays Yusupov's Ten Commandments");

export async function execute(interaction) {
    const embed = {
        title: "Yusupov's Ten Commandments",
        description: `1. Thou shalt not allow counterplay. (📘3:5)
2. Thou shalt not be hasty. (📘3:12)
3. Thou shalt exploit weaknesses in the position. (📙2:4)
4. Thou shalt realize a material advantage. (📙1:13)
5. Thou shalt improve the position of thou pieces. (📘2:23)
6. Thou shalt look for active moves. (📘3:15)
7. Thou shalt always have a plan. (📗3:21)
8. Thou shalt adhere to the Principle of Two Weaknesses. (📘3:20)
9. Thou shalt seek to gain an advantage in space. (📘3:21)
10. Thou shalt make the correct exchanges. (📘3:24)`,
        color: 692769,
    };

    await interaction.reply({ embeds: [embed], ephemeral: false });
}