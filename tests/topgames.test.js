import { describe, it, expect, vi } from 'vitest';
import { execute } from '../commands/topgames.js';
import { beforeEach } from 'vitest'
import fetch from 'node-fetch';

vi.mock('node-fetch');

describe('#topgames command', () => {
    let interaction;

    beforeEach(() => {
        interaction = {
            options: {
                getString: vi.fn()
            },
            reply: vi.fn()
        };
    });

    it('should fetch and display the top games successfully', async () => {
        const mockData = {
            topGames: [
                { id: 'game1', white: { name: 'Player1' }, black: { name: 'Player2' } },
                { id: 'game2', white: { name: 'Player3' }, black: { name: 'Player4' } }
            ]
        };

        fetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockData)
        });

        interaction.options.getString.mockReturnValue('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        await execute(interaction);

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://explorer.lichess.ovh/masters?fen='));
        expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
            embeds: expect.arrayContaining([
                expect.objectContaining({
                    title: 'Top Games',
                    description: expect.stringContaining('**The 15 top games played from the given position:**'),
                    fields: expect.arrayContaining([
                        expect.objectContaining({ name: 'Top 15 Games', value: "[Player1 vs Player2](https://lichess.org/game1)\n[Player3 vs Player4](https://lichess.org/game2)" })
                    ])
                })
            ])
        }));
    });

    it('should handle errors when fetching data', async () => {
        fetch.mockResolvedValue({
            ok: false
        });

        interaction.options.getString.mockReturnValue('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        await execute(interaction);

        expect(interaction.reply).toHaveBeenCalledWith({
            content: 'There was an error while getting the top games.',
            ephemeral: true
        });
    });

    it('should handle exceptions thrown during execution', async () => {
        fetch.mockRejectedValue(new Error('Network error'));

        interaction.options.getString.mockReturnValue('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        await execute(interaction);

        expect(interaction.reply).toHaveBeenCalledWith({
            content: 'There was an error while getting the top games.',
            ephemeral: true
        });
    });
});