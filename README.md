# Yusu-Bot

## Commands

### `/eval`

**Description:**  
Evaluates the given FEN position using https://lichess.org/api/cloud-eval and returns the evaluation score.

**Usage:**  
`/eval fen:<FEN_STRING>`

**Parameters:**
- `fen` (required): The FEN string of the chess position.

**Example:**  
`/eval fen:r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 7`

### `/import`

**Description:**  
Imports a PGN (Portable Game Notation) file to Lichess and returns the link to the game.

**Usage:**  
`/import pgn:<PGN_STRING>`

**Parameters:**
- `pgn` (required): The PGN string of the chess game.

**Example:**  
`/import pgn:[Event "F/S Return Match"] [Site "Belgrade, Serbia JUG"] [Date "1992.11.04"] [Round "29"] [White "Fischer, Robert J."] [Black "Spassky, Boris V."] [Result "1/2-1/2"] 1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. Nc3 Qc7 13. a3 Bb7 14. Bg5 h6 15. Bh4 Rfe8 16. Rc1 Bf8 17. Ba2 g6 18. Bg3 Bg7`

### `/stats`

**Description:**  
Displays statistics for a given chess position from the Lichess master games database.

**Usage:**  
`/stats fen:<FEN_STRING>`

**Parameters:**
- `fen` (required): The FEN string of the chess position.

**Example:**  
`/stats fen:r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 7`

### `/topmoves`

**Description:**  
Displays the top moves Get the cached evaluation of a position, if available by [Lichess](https://lichess.org/api/cloud-eval) for a given FEN position.

**Usage:**  
`/topmoves fen:<FEN_STRING>`

**Parameters:**
- `fen` (required): The FEN string of the chess position.

**Example:**  
`/topmoves fen:r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 7`

### `/topgames`

**Description:**  
Displays the top 15 games of the Lichess master database, played from a given FEN position.

**Usage:**  
`/topgames fen:<FEN_STRING>`

**Parameters:**
- `fen` (required): The FEN string of the chess position.

**Example:**  
`/topgames fen:r1bqk2r/1pp1bppp/p1p2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 7`

### `/help`

**Description:**  
View command infos

**Usage:**  
`/help`

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

