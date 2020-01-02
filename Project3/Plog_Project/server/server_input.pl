%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- include('../controller/game.pl').

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

% ======================================================================================
%   Initialize Data Structures
% ======================================================================================
% board
parse_input(init_board, Board):-
    init_board(Board).

% white pieces
parse_input(init_white_pieces, White_Board):-
    init_white_pieces(White_Board).

% brown pieces
parse_input(init_brown_pieces, Board):-
    init_brown_pieces(Board).

% ======================================================================================
%   Move
% ======================================================================================
% Move -> [row, column, piece]
% Player -> 1 (white pieces) or 2 (brown pieces)
% valid move
parse_input(move(Move, Board, White_Pieces, Brown_Pieces, Player), [ValidMove, New_Board, New_White_Pieces, New_Brown_Pieces]):-
    move(0, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces),
    ValidMove = true.
% invalid move
parse_input(move(Move, Board, White_Pieces, Brown_Pieces, Player), [ValidMove, [], [], []]):-
    \+move(0, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces),
    ValidMove = false.

% ======================================================================================
%   Game Over
% ======================================================================================
% game_over(_Show_Message, Board, _Winner, [Row|[Column|_Piece]], _White_Pieces, _Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2)
% game_over 'returns' yes if game is not over
% Move -> [Row|[Column|_Piece]]
parse_input(game_over(Board, Move), [GameOver]):-
    game_over(0, Board, _, Move, _, _, _, _, _, _),
    GameOver = false.

parse_input(game_over(Board, Move), [GameOver]):-
    \+game_over(0, Board, _, Move, _, _, _, _, _, _),
    GameOver = true.

% ======================================================================================
%   Game Tied
% ======================================================================================
% Get both players List of Moves with only valid moves
% valid_moves(1, Board, White_Pieces, Brown_Pieces, Player, List_Of_Moves).
% if List_Of_Moves == 0 then game is tied
% Player -> 1 (white pieces) or 2 (brown pieces)
% Player 1 (white pieces)
parse_input(game_tied(Board, White_Pieces, Brown_Pieces), [Game_Tied]):-
    valid_moves(1, Board, White_Pieces, Brown_Pieces, 1, List_Of_White_Moves),
    length(List_Of_White_Moves, List_Of_White_Moves_Size),
    List_Of_White_Moves_Size == 0,
    Game_Tied = true.

% Player 2 (brown pieces)
parse_input(game_tied(Board, White_Pieces, Brown_Pieces), [Game_Tied]):-
    valid_moves(1, Board, White_Pieces, Brown_Pieces, 2, List_Of_Brown_Moves),
    length(List_Of_Brown_Moves, List_Of_Brown_Moves_Size),
    List_Of_Brown_Moves_Size == 0,
    Game_Tied = true.

parse_input(game_tied(_, _, _), [Game_Tied]):-
    Game_Tied = false.

% ======================================================================================
%   Bot Move
% ======================================================================================
% Move -> [row, column, piece]
% Player -> 1 (white pieces) or 2 (brown pieces)
parse_input(bot_move(Level, Board, White_Pieces, Brown_Pieces, Player), [New_Board, New_White_Pieces, New_Brown_Pieces, Move, Game_Tied]):-
    choose_move(Board, White_Pieces, Brown_Pieces, Level, Move, Player),
    move(0, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces),
    Game_Tied = false.

% bot_move only fails when there aren't any more plays left
parse_input(bot_move(Level, Board, White_Pieces, Brown_Pieces, Player), [New_Board, New_White_Pieces, New_Brown_Pieces, Move, Game_Tied]):-
    Game_Tied = true. 