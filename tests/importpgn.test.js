import { describe, it, expect, vi } from 'vitest';
import { execute } from '../commands/importpgn.js';
import fetch from 'node-fetch';

vi.mock('node-fetch');

describe('importpgn command', () => {
  it('should successfully import a PGN and reply with game information', async () => {
    const mockInteraction = {
      isCommand: () => true,
      commandName: 'importpgn',
      options: {
        getString: vi.fn().mockReturnValue('sample PGN string')
      },
      reply: vi.fn()
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        url: 'https://lichess.org/sample-game'
      })
    });

    await execute(mockInteraction);

    expect(fetch).toHaveBeenCalledWith('https://lichess.org/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      },
      body: 'pgn=sample%20PGN%20string'
    });

    expect(mockInteraction.reply).toHaveBeenCalledWith({
      embeds: [
        {
          color: 0x0099ff,
          title: 'Lichess Game Import',
          description: 'Your game has been successfully imported to Lichess.',
          fields: [
            { name: 'Game URL', value: 'https://lichess.org/sample-game' },
            { name: 'PGN', value: '```sample PGN string```' }
          ],
          timestamp: expect.any(Date),
          footer: {
            text: 'Lichess Game Importer'
          }
        }
      ]
    });
  });

  it('should handle errors from the Lichess API', async () => {
    const mockInteraction = {
      isCommand: () => true,
      commandName: 'importpgn',
      options: {
        getString: vi.fn().mockReturnValue('sample PGN string')
      },
      reply: vi.fn()
    };

    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        error: 'Invalid PGN'
      })
    });

    await execute(mockInteraction);

    expect(mockInteraction.reply).toHaveBeenCalledWith('Error: Invalid PGN');
  });

  it('should handle non-JSON responses from the Lichess API', async () => {
    const mockInteraction = {
      isCommand: () => true,
      commandName: 'importpgn',
      options: {
        getString: vi.fn().mockReturnValue('sample PGN string')
      },
      reply: vi.fn()
    };

    fetch.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('<html>Error</html>')
    });

    await execute(mockInteraction);
  });
});