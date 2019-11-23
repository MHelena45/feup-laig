% Gets a move to be played by the computer
% The move is chosen considering the level of dificulty of the game
choose_move(Board, White_Pieces, Brown_Pieces, Level, Move, Player) :-
    valid_moves(Level, Board, White_Pieces, Brown_Pieces, Player, List_Of_Moves),
    get_move(Level, List_Of_Moves, Move).

% Gets a List of Moves with only valid moves
valid_moves(1, Board, White_Pieces, Brown_Pieces, Player, List_Of_Moves) :-
    getPiecesAvailable( White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces),
    setof(Move, valid_move(0, Move, Player, Board, New_White_Pieces, New_Brown_Pieces), List_Of_Moves),
    sleep(1).           % used for let the user see the play done

% Return in List_of_Moves only the best moves at the moment
valid_moves(Level, Board, White_Pieces, Brown_Pieces, Player, List_Of_Moves) :-
    getPiecesAvailable( White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces),
    setof([Value|Move], (valid_move(0, Move, Player, Board, New_White_Pieces, New_Brown_Pieces), 
        calc_value(Level, Board, Player, Move, New_White_Pieces, New_Brown_Pieces, Value)), Value_List_Of_Moves),        
    nth0(0, Value_List_Of_Moves, [Value | _One_Most_Value_Move]),   % gets the lowest value of the game
    setof(Move1, member([Value | Move1], Value_List_Of_Moves), List_Of_Moves).

% Gets a random move from the List of moves that was previously obtained 
get_move(_Level, List_Of_Moves, Move) :-  
    random_member(Move, List_Of_Moves).   

% Simulates a move on a temporary board and then evaluates the quality of that board
calc_value(Level, Board, Player, Move, White_Pieces, Brown_Pieces, Value) :-  
    move_piece(Move, Board, New_Board), % Simulates the move                                         
    remove_piece(Move, Player, White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces), % Removes piece used from the available pieces board
    value(Level, New_Board, Player, Move, New_White_Pieces, New_Brown_Pieces, Value).

% ======================================================================================================
%                Evaluates Boards with Value between 0 (less value) and -66 (most value)
% ======================================================================================================
% ------ SECOND LEVEL Moves ------
% If Board is in a win state -> value = -66.
value(_Level, Board, _Player, Move, _White_Pieces, _Brown_Pieces, -66) :-
    not(game_over(0, Board, _Player, Move, _White_Pieces, _Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2)),
    !.

% If There is a winning move for the opponent player -> value = 10.
value(_Level, Board, Player, _Move, White_Pieces, Brown_Pieces, 10) :- 
    change_player(1, Player, New_Player),
    setof(Move, (valid_move(0, Move, New_Player, Board, White_Pieces, Brown_Pieces),
        move_piece(Move, Board, New_Board),
        not(game_over(0, New_Board, _New_Player, Move, _White_Pieces, _Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2))), _List_Of_Moves),
    !. 

% If we can win in the next play with a move that the opponent can't make
value(_Level, Board, Player, _Move, White_Pieces, Brown_Pieces, -65) :-
    change_player(1, Player, New_Player),   % Gets the number of the opponent
    setof([Row, Column, Piece], 
        (valid_move(0, [Row, Column, Piece], Player, Board, White_Pieces, Brown_Pieces), % Gets valid moves
        get_opposite(Other_Piece, Piece),                                                % Gets piece of the other player with the same form
        not(valid_move(0, [Row, Column, Other_Piece], New_Player, Board, White_Pieces, Brown_Pieces)),  % Checks if the move can't be played by the opponent
        move_piece([Row, Column, Piece], Board, New_Board),                                             % Makes move on a temporary board
        not(game_over(0, New_Board, _Player, [Row, Column, Piece], _White_Pieces, _Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2))), _List_Of_Moves), % Check end game
    !.

% Level 2 evaluates with 0 all the moves that did not verify any of the conditions above
% Because level 1 doesn't evaluate the moves and level 3 evaluates all plays in the condition below,
value(2, _Board, _Player, _Move, _White_Pieces, _Brown_Pieces, 0).

% ------ THIRD LEVEL PLAYS ------
% If the move reduces the number of moves of the opponet Player, the piece
%  is a row, column ou square where the play hasn't already been played 
value(3, Board, Player, _Move, White_Pieces, Brown_Pieces, Value) :-
    change_player(1, Player, New_Player),
    % Gets the valid_moves of the opponent
    setof(Move, valid_move(0, Move, New_Player, Board, White_Pieces, Brown_Pieces), List_Of_Moves),
    length(List_Of_Moves, Length), 
    Value is -64 + Length. % If the number of plays of the other player is reduced then the value is greater to us

not(X) :- X, !, fail.           % if (X is true) then return fail
not(_X).                        % else sucess

% ======================================================================
% ----------------------- Get Pieces Available -------------------------
% ======================================================================

% getPiecesAvailable is used to get only the Pieces we can play, no pieces equal to 0 or duplicated.
% This functions were created to improve the efficiency of the computer plays
% removes dups and 0's from the available pieces
getPiecesAvailable(White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces) :-
    remove_dups(White_Pieces, White_Pieces1), % removes dups and all 0 execpt one
    select(0, White_Pieces1, New_White_Pieces), % remove last 0 remaining
    remove_dups( Brown_Pieces,  Brown_Pieces1), % removes dups and all 0 execpt one
    select(0,  Brown_Pieces1, New_Brown_Pieces). % remove last 0 remaining

% if there are no 0s just remove duplicated pieces (only in 2 first plays)
getPiecesAvailable(White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces) :-
    remove_dups(White_Pieces, New_White_Pieces), % removes dups and all 0 execpt one
    remove_dups( Brown_Pieces, New_Brown_Pieces). % removes dups and all 0 execpt one