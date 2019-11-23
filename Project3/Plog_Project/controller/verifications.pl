% ========================================================================
% --------------------------- VERIFICATIONS ------------------------------
% =========================================================================

% =================================================================================
%       Deal with invalid moves
% =================================================================================

valid_move(0, [Row,Column,Piece], Player, Board, White_Pieces, Brown_Pieces) :-
    between(1, 4, Row), between(1, 4, Column), valid_piece(Piece),
    is_cell_empty(0, Board, Row, Column), % Checks if the position is empty 
    valid_play(0, Board, Row, Column, Piece), % Checks if the move is valid
    is_piece_available(0, Player, Piece, White_Pieces, Brown_Pieces). % Checks if the piece is available (2 equal pieces max per player)

valid_move(1, [Row,Column,Piece], Player, Board, White_Pieces, Brown_Pieces) :-
    is_cell_empty(1, Board, Row, Column), % Checks if the position is empty 
    !, %red cut, used to prevent more than one error message
    valid_play(1, Board, Row, Column, Piece), % Checks if the move is valid
    !, %red cut, used to prevent more than one error message
    is_piece_available(1, Player, Piece, White_Pieces, Brown_Pieces). % Checks if the piece is available (2 equal pieces max per player)

% ------------------------------- IS CELL EMPTY ---------------------------------

/* Check if given cell does not have a piece, if true the game continues */
is_cell_empty(_Show_Error_Message, Board, Row, Column) :-
    get_piece_from_board(Row, Column, Board, Piece),
    Piece == 0.
    
/* If is not empty, player as to play again. An error message is displayed. */
is_cell_empty(1, _Board, Row, Column) :-
    not_empty_message(Row, Column), % Displays message to user
    fail.

% ----------------------------------- PIECE AVAILABLE ---------------------------------
% Player 1
is_piece_available( _Show_Error_Message, 1, Piece, White_Pieces, _Brown_Pieces) :-
    member(Piece, White_Pieces).

% Player 2
is_piece_available( _Show_Error_Message, 2, Piece, _White_Pieces, Brown_Pieces) :-
    member(Piece, Brown_Pieces).

% Error mensages
is_piece_available(1, _Player, _Piece, _White_Pieces, _Brown_Pieces) :-
    unavailable_piece_message,
    fail.

% Number of Row in Pieces Board for each piece
piece_row(11, 1). % White Cone
piece_row(51, 2). % White Cube
piece_row(71, 3). % White Cylinder
piece_row(91, 4). % White Sphere
piece_row(12, 1). % Brown Cone
piece_row(52, 2). % Brown Cube
piece_row(72, 3). % Brown Cylinder
piece_row(92, 4). % Brown Sphere

% ----------------------------------- GAME OVER ---------------------------------
% Sucsess if game is not over
game_over(_Show_Message, Board, _Winner, [Row|[Column|_Piece]], _White_Pieces, _Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2) :-
    get_row_sum(Board, Row, Row_Sum),
    Row_Sum =\= 22,
    get_column_sum(Board, Column, 0, Col_Sum),
    Col_Sum =\= 22,
    get_square_num(Row, Column, Square_Num),
    get_square_sum(Square_Num, Board, Square_Sum),
    Square_Sum =\= 22.

game_over(1, Board, Winner, _Move, White_Pieces, Brown_Pieces, Mode, Difficulty_Level, Score1, Score2) :-
    display_game(Board, 0, White_Pieces, Brown_Pieces),
    get_num_player(Mode, Winner, Player),
    addScore(Player, Score1, Score2, New_Score1, New_Score2),
    congratulate_winner(Player, Mode, New_Score1, New_Score2),
    get_interaction(Ans),
    playAgain(Ans, Mode, Difficulty_Level, New_Score1, New_Score2).

addScore(1, Score1, Score2, New_Score1, Score2) :-
    New_Score1 is Score1 + 1.

addScore(2, Score1, Score2, Score1, New_Score2) :-
    New_Score2 is Score2 + 1.

playAgain(0, _Mode, _Difficulty_Level, _Score1, _Score2) :-
    play.

playAgain(_Ans, Mode, Difficulty_Level, Score1, Score2) :-
    start_game_mode(Mode, Difficulty_Level, Score1, Score2).

% =========================================================================================
%                               Gets the rigth end menu
% =========================================================================================

congratulate_winner(Player, 4, Score1, Score2) :-   % Winner is Player in a game Computer vs Computer
    print_computer_congratulations(Player, Score1, Score2).

congratulate_winner(Player, 1, Score1, Score2) :-   % Winner is Player in a game Person vs Person
    print_congratulations(Player, Score1, Score2).

congratulate_winner(2, 2, Score1, Score2) :- % player 2 is the winner in mode 2
    print_sorry(Score1, Score2).             % the computer wins the person

congratulate_winner(1, 3, Score1, Score2) :- % player 1 is the winner in mode 2
    print_sorry(Score1, Score2).             % the computer wins the person

congratulate_winner(_, _, Score1, Score2) :-  % The person won the computer
    print_congratulations(Score1, Score2).

get_row_sum([Row| _Rest], 1, Solution) :-
    sum_row(Row, 0, Solution).
get_row_sum([_Row| Rest], Num_Row, Sum) :-
    Num_Row > 1,
    Num_Row1 is Num_Row - 1,
    get_row_sum(Rest, Num_Row1, Sum).

sum_row([], Sum, Sum).
sum_row([Col| More], Sum, Solution) :-
    Value is div(Col, 10),
    Sum1 is Sum + Value,
    sum_row(More, Sum1, Solution).

get_column_sum([], _Column, Sum, Sum).
get_column_sum([Row| Rest], Column, Sum, Solution) :-
    get_row_value(Row, Column, Value),
    Sum1 is Value + Sum, 
    get_column_sum(Rest, Column, Sum1, Solution).

get_row_value([Col| _More], 1, Value) :-
    Value is div(Col, 10).
get_row_value([_Col| More], Num_Column, Value) :-
    Num_Column > 1,
    Num_Column1 is Num_Column - 1,
    get_row_value(More, Num_Column1, Value).

get_square_sum(1, Board, Square_Sum) :-
    get_square_value(1, 1, Board, Value1),
    get_square_value(1, 2, Board, Value2),
    get_square_value(2, 1, Board, Value3),
    get_square_value(2, 2, Board, Value4),
    Square_Sum1 is Value1 + Value2,
    Square_Sum2 is Value3 + Value4,
    Square_Sum is Square_Sum1 + Square_Sum2.

get_square_sum(2, Board, Square_Sum) :-
    get_square_value(1, 3, Board, Value1),
    get_square_value(1, 4, Board, Value2),
    get_square_value(2, 3, Board, Value3),
    get_square_value(2, 4, Board, Value4),
    Square_Sum1 is Value1 + Value2,
    Square_Sum2 is Value3 + Value4,
    Square_Sum is Square_Sum1 + Square_Sum2.

get_square_sum(3, Board, Square_Sum) :-
    get_square_value(3, 1, Board, Value1),
    get_square_value(3, 2, Board, Value2),
    get_square_value(4, 1, Board, Value3),
    get_square_value(4, 2, Board, Value4),
    Square_Sum1 is Value1 + Value2,
    Square_Sum2 is Value3 + Value4,
    Square_Sum is Square_Sum1 + Square_Sum2.

get_square_sum(4, Board, Square_Sum) :-
    get_square_value(3, 3, Board, Value1),
    get_square_value(3, 4, Board, Value2),
    get_square_value(4, 3, Board, Value3),
    get_square_value(4, 4, Board, Value4),
    Square_Sum1 is Value1 + Value2,
    Square_Sum2 is Value3 + Value4,
    Square_Sum is Square_Sum1 + Square_Sum2.

get_square_value(Row, Column, Board, Value) :-
    get_piece_from_board(Row, Column, Board, Piece),
    Value is div(Piece, 10).

% ----------------------------------- VALID MOVE ---------------------------------

valid_play(_Show_Error_Message, Board, Row, Column, Piece) :-
    Row1 is Row + 1,
    check_top(Row1, Column, Board, Piece),
    Row2 is Row - 1,
    check_down(Row2, Column, Board, Piece), 
    Column1 is Column + 1,
    check_left(Row, Column1, Board, Piece),
    Column2 is Column - 1,
    check_rigth(Row, Column2, Board, Piece),
    get_square_num(Row, Column, Square_Num),
    check_square(Square_Num, Piece, Board).

valid_play(1, _Board, _Row, _Column, _Piece) :-
    wrong_move_message,
    fail.

check_top(5, _Column, _Board, _Piece).
check_top(Row, Column, Board, Piece) :-
    get_opposite(Piece, Opposite),
    compare_piece(Row, Column, Board, Opposite),
    New_Row is Row + 1,
    check_top(New_Row, Column, Board, Piece).

check_down(0, _Column, _Board, _Piece).
check_down(Row, Column, Board, Piece) :-
    get_opposite(Piece, Opposite),
    compare_piece(Row, Column, Board, Opposite),
    New_Row is Row - 1,
    check_down(New_Row, Column, Board, Piece).

check_left(_Row, 5, _Board, _Piece).
check_left(Row, Column, Board, Piece) :-
    get_opposite(Piece, Opposite),
    compare_piece(Row, Column, Board, Opposite),
    New_Column is Column + 1,
    check_left(Row, New_Column, Board, Piece).

check_rigth(_Row, 0, _Board, _Piece).
check_rigth(Row, Column, Board, Piece) :-
    get_opposite(Piece, Opposite),
    compare_piece(Row, Column, Board, Opposite),
    New_Column is Column - 1,
    check_rigth(Row, New_Column, Board, Piece).

check_square(1, Piece, Board) :-
    get_opposite(Piece, Opposite),
    compare_piece(1, 1, Board, Opposite),
    compare_piece(1, 2, Board, Opposite),
    compare_piece(2, 1, Board, Opposite),
    compare_piece(2, 2, Board, Opposite).
    
check_square(2, Piece, Board) :-
    get_opposite(Piece, Opposite),
    compare_piece(1, 3, Board, Opposite),
    compare_piece(1, 4, Board, Opposite),
    compare_piece(2, 3, Board, Opposite),
    compare_piece(2, 4, Board, Opposite).

check_square(3, Piece, Board) :-
    get_opposite(Piece, Opposite),
    compare_piece(3, 1, Board, Opposite),
    compare_piece(3, 2, Board, Opposite),
    compare_piece(4, 1, Board, Opposite),
    compare_piece(4, 2, Board, Opposite).

check_square(4, Piece, Board) :-
    get_opposite(Piece, Opposite),
    compare_piece(3, 3, Board, Opposite),
    compare_piece(3, 4, Board, Opposite),
    compare_piece(4, 3, Board, Opposite),
    compare_piece(4, 4, Board, Opposite).

compare_piece(Row, Column, Board, Opposite) :-
    get_piece_from_board(Row, Column, Board, Piece),
    Piece =\= Opposite.

get_square_num(Row, Column, 1) :-
    Row < 3, 
    Column < 3.

get_square_num(Row, Column, 2) :-
    Row < 3, 
    Column > 2.

get_square_num(Row, Column, 3) :-
    Row > 2, 
    Column < 3.

get_square_num(Row, Column, 4) :-
    Row > 2, 
    Column > 2.

/* Piece we can not find in the same row, column ou square */
get_opposite(11, 12).
get_opposite(51, 52).
get_opposite(71, 72).
get_opposite(91, 92).

get_opposite(12, 11).
get_opposite(52, 51).
get_opposite(72, 71).
get_opposite(92, 91).

% ----------------------------------- CHECK PIECE ---------------------------------
% Accepted piece input
check_piece(cone).
check_piece(sphere).
check_piece(cylinder).
check_piece(cube).

% ----------------------------------- VALID Piece ---------------------------------
% Checks if piece is valid in data struct representation
valid_piece(11).
valid_piece(51).
valid_piece(71).
valid_piece(91).
valid_piece(12).
valid_piece(52).
valid_piece(72).
valid_piece(92).

% =================================
%           Get Piece
% =================================
get_piece_from_list([H|_T], 1, Piece) :-
    Piece = H.

get_piece_from_list([_H|T], Index, Piece) :-
    Index > 1,
    Index1 is Index - 1,
    get_piece_from_list(T, Index1, Piece).

get_piece_from_board(1, Column, [H|_T], Piece) :-
    get_piece_from_list(H, Column, Piece).

get_piece_from_board(Row, Column, [_H|T], Piece) :-
    Row > 1,
    Row1 is Row - 1,
    get_piece_from_board(Row1, Column, T, Piece).
