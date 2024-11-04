import { describe, it, expect, vi } from 'vitest';
import { execute } from '../commands/stats.js';
import { beforeEach } from 'vitest'
import fetch from 'node-fetch';

vi.mock('node-fetch');

describe('#stats command', () => {
    let interaction;

    beforeEach(() => {
        interaction = {
            options: {
                getString: vi.fn()
            },
            reply: vi.fn()
        };
    });

    it('should fetch and display opening statistics successfully', async () => {
        const mockData = {
            moves: [
                { san: 'e4', white: 50, draws: 30, black: 20 },
                { san: 'd4', white: 40, draws: 40, black: 20 }
            ],
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
                    title: 'Opening Statistics',
                    description: expect.stringContaining('**Most Played Moves:**\n> **e4:** 50.00% W, 30.00% D, 20.00% L (100 games)\n> **d4:** 40.00% W, 40.00% D, 20.00% L (100 games)'),
                    fields: expect.arrayContaining([
                        expect.objectContaining({ name: 'Top 5 Games' })
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
            content: 'There was an error while getting the opening statistics.',
            ephemeral: true
        });
    });

    it('should handle exceptions thrown during execution', async () => {
        fetch.mockRejectedValue(new Error('Network error'));

        interaction.options.getString.mockReturnValue('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

        await execute(interaction);

        expect(interaction.reply).toHaveBeenCalledWith({
            content: 'There was an error while getting the opening statistics.',
            ephemeral: true
        });
    });
});