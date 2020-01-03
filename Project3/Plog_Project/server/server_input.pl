%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- include('../controller/game.pl').

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

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
parse_input(move(_Move, _Board, _White_Pieces, _Brown_Pieces, _Player), [ValidMove, [], [], []]):-
    ValidMove = false.

% ======================================================================================
%   Bot Move
% ======================================================================================
% Move -> [row, column, piece]
% Player -> 1 (white pieces) or 2 (brown pieces)
parse_input(bot_move(Level, Board, White_Pieces, Brown_Pieces, Player), [New_Board, New_White_Pieces, New_Brown_Pieces, Move]):-
    choose_move(Board, White_Pieces, Brown_Pieces, Level, Move, Player),
    move(0, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces).

% ======================================================================================
%   Game Over & Game Tied
% ======================================================================================
parse_input(evaluate_game(Board, White_Pieces, Brown_Pieces, Move, Player), [Game_Over, Game_Tied]):-
    % evaluate game over
    get_game_over(Board, Move, Game_Over),
    % evaluate game tied
    get_game_tied(Board, White_Pieces, Brown_Pieces, Player, Game_Tied).

% game_over(_Show_Message, Board, _Winner, [Row|[Column|_Piece]], _White_Pieces, _Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2)
% game_over 'returns' yes if game is not over
% Move -> [Row|[Column|_Piece]]
get_game_over(Board, Move, Game_Over):-
    game_over(0, Board, _, Move, _, _, _, _, _, _),
    Game_Over = false.

get_game_over(_Board, _Move, Game_Over):-
    Game_Over = true.

% Get both players List of Moves with only valid moves
% valid_moves(1, Board, White_Pieces, Brown_Pieces, Player, List_Of_Moves).
% if List_Of_Moves == 0 then game is tied
% Player -> 1 (white pieces) or 2 (brown pieces)
% Player 1 (white pieces)
get_game_tied(Board, White_Pieces, Brown_Pieces, Player, Game_Tied):-
    Player == 0,
    valid_moves(1, Board, White_Pieces, Brown_Pieces, 1, List_Of_White_Moves),
    length(List_Of_White_Moves, List_Of_White_Moves_Size),
    List_Of_White_Moves_Size == 0,
    Game_Tied = true.

% Player 2 (brown pieces)
get_game_tied(Board, White_Pieces, Brown_Pieces, Player, Game_Tied):-
    Player == 1,
    valid_moves(1, Board, White_Pieces, Brown_Pieces, 2, List_Of_Brown_Moves),
    length(List_Of_Brown_Moves, List_Of_Brown_Moves_Size),
    List_Of_Brown_Moves_Size == 0,
    Game_Tied = true.

get_game_tied(_Board, _White_Pieces, _Brown_Pieces, _Player, Game_Tied):-
    Game_Tied = false.
