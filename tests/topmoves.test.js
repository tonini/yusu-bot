// FILE: topmoves.test.js

import { describe, it, expect, vi } from 'vitest';
import { execute, formatTopMoves } from '../commands/topmoves.js';
import { Chess } from 'chess.js';

describe('#topmoves Command', () => {
    it('should format top moves correctly', () => {
        const fen = 'r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 7';
        const topMoves = 'c8g4 h2h3 g4h5 c1e3 d8d6 b1d2 d6e6 d2c4 e8a8 f3g5';
        const expectedOutput = '7. ... Bg4\n';

        const result = formatTopMoves(topMoves, fen);
        expect(result).toBe(expectedOutput);
    });

    it('should handle interaction correctly', async () => {
        const interaction = {
            options: {
                getString: vi.fn().mockReturnValue('r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 7')
            },
            reply: vi.fn()
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    pvs: [
                        { moves: 'c8g4 h2h3 g4h5 c1e3 d8d6 b1d2 d6e6 d2c4 e8a8 f3g5', cp: 5 },
                        { moves: 'd8d6 b1d2 c8e6 f3g5 e8a8 g5e6 d6e6 d1e2 f6e8 a2a4', cp: 5 },
                        { moves: 'e7d6 b1d2 c8g4 h2h3 g4h5 d2c4 f6d7 c4a5 a8b8 c1e3', cp: 6 }
                    ]
                })
            })
        );

        await execute(interaction);

        expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
            embeds: expect.arrayContaining([
                expect.objectContaining({
                    title: expect.stringContaining('**Top Cloud Engine Moves:**'),
                    description: expect.stringContaining("**[View on Lichess](https://lichess.org/analysis/r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1_b_kq_-_0_7)**")
                })
            ])
        }));
    });
});