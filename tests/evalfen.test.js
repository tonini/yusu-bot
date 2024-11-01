import { describe, it, expect, vi } from 'vitest';
import { data, execute } from '../commands/evalfen.js';

describe('evalfen command', () => {
  it('should evaluate a FEN position and reply with the evaluation and image', async () => {
    const mockInteraction = {
      isCommand: () => true,
      commandName: 'evalfen',
      options: {
        getString: vi.fn().mockReturnValue('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3')
      },
      reply: vi.fn()
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          pvs: [{ cp: 50 }]
        })
      })
    );

    await execute(mockInteraction);

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      embeds: [
        {
          title: expect.stringContaining("**Position Evaluation:** 0.18 pawns"),
          description: expect.stringContaining("**[View on Lichess](https://lichess.org/analysis/r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R_b_KQkq_-_3_3)**"),
          image: { url: expect.stringContaining("https://chess.com/dynboard/?fen=r1bqkbnr%2Fpppp1ppp%2F2n5%2F1B2p3%2F4P3%2F5N2%2FPPPP1PPP%2FRNBQK2R%20b%20KQkq%20-%203%203%20-%20-%20-&board=green&piece=neo&size=3&&coordinates=Outside") },
          color: 692769
        }
      ], ephemeral: false
    });
  });
});