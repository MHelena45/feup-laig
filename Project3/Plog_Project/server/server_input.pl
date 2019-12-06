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
parse_input(init_white_pieces, Board):-
    init_white_pieces(Board).

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
parse_input(move(Move, Board, White_Pieces, Brown_Pieces, Player), [ValidMove, New_Board, New_White_Pieces, New_Brown_Pieces]):-
    \+move(0, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces),
    ValidMove = false.
