:- include('menu.pl').
:- include('verifications.pl').
:- include('computer.pl').
:- include('../View/board_printer.pl').
:- include('../View/user_interactions.pl').
:- include('../View/menu_printer.pl').
:- include('../Model/data_structs.pl').
:- use_module(library(system)).
:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(between)).

play :-
    main_menu(Mode, Difficulty_Level),
    start_game_mode(Mode, Difficulty_Level, 0, 0).

% ======================================================================================
%   Starts acording to the option chosen in the main menu
% ======================================================================================
start_game_mode(Mode, Difficulty_Level, Score1, Score2) :-
    init_boards(Board, White_Pieces, Brown_Pieces), % Initialization of data structures
    get_initial_player(Mode, Player),
    display_game(Board, Player, White_Pieces, Brown_Pieces), % Displaying the main game & the available pieces
    play(Player, Mode, Difficulty_Level, Board, White_Pieces, Brown_Pieces, Score1, Score2). % Player 1 starts the game
    
% Initialization of data structures
init_boards(Board, White_Pieces, Brown_Pieces)  :-
    init_board(Board), % Initialization of the board
    init_white_pieces(White_Pieces), % Initialization of the white pieces board for display
    init_brown_pieces(Brown_Pieces). % Initialization of the brown pieces board for display

get_initial_player(1, 1). % Mode 1: Player vs Player - Player1 starts
get_initial_player(2, 1). % Mode 2: Player vs Computer - Player1 starts
get_initial_player(3, 3). % Mode 3: Computer vs Player - Computer starts
get_initial_player(4, 3). % Mode 4: Computer vs Computer - Computer starts

% ============================================================================================================
%      Main loop of the game
% ================================================================================================================

 % Given the player, it plays the piece on the given position
play(Player, Mode, Difficulty_Level, Board, White_Pieces, Brown_Pieces, Score1, Score2) :-
    play_move(Player, Mode, Difficulty_Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2 ),  
    change_player(Mode, Player, New_Player), % Changes current player based on mode
    display_game(New_Board, New_Player, New_White_Pieces, New_Brown_Pieces),
    play(New_Player, Mode, Difficulty_Level, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2).  % Changes current board

% move of Player 1
play_move(1, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2) :-
    play_person(1, Mode, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Level, Score1, Score2).
% move of player 2
play_move(2, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2) :-
    play_person(2, Mode, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Level, Score1, Score2).

% move of computer 1
play_move(3, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2) :-
    play_computer(3, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2).
% move of computer 2
play_move(4, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2) :-
    play_computer(4, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2).

% Person Player plays
play_person(Player, Mode, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Level, Score1, Score2) :-
    check_moves_available(Player, Board, White_Pieces, Brown_Pieces, Mode, Level, Score1, Score2),
    repeat, % if the colocation of the piece fails, we ask again the all play
    get_move(Move, Player), % Asks the move from player
    move(1, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces),
    game_over(1, New_Board, Player, Move, New_White_Pieces, New_Brown_Pieces, Mode, 1, Score1, Score2). % level isn't use

% Computer plays
play_computer(Computer_Player, Mode, Level, Board, White_Pieces, Brown_Pieces, New_Board, New_White_Pieces, New_Brown_Pieces, Score1, Score2) :-
    get_num_player(Mode, Computer_Player, Player),
    check_moves_available(Player, Board, White_Pieces, Brown_Pieces, Mode, Level, Score1, Score2),
    choose_move(Board, White_Pieces, Brown_Pieces, Level, Move, Player), % Only generates valid moves
    move_piece(Move, Board, New_Board),         % change the board
    remove_piece(Move, Player, White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces),  % remove piece play from the available ones
    game_over(1, New_Board, Computer_Player, Move, New_White_Pieces, New_Brown_Pieces, Mode, Level, Score1, Score2). % check end

% ===================================================================================
%                              CHANGE PLAYER
% Changes the current player based on current game mode
% ===================================================================================

% Mode 1: Player vs Player
change_player(1, 1, 2).   % change_player(Mode, Player, New_Player).
change_player(1, 2, 1). 
% Mode 2: Player vs Computer
change_player(2, 1, 3).
change_player(2, 3, 1).
% Mode 3: Computer vs Player
change_player(3, 3, 2).
change_player(3, 2, 3).
% Mode 4: Computer vs Computer
change_player(4, 3, 4).
change_player(4, 4, 3).

% ==============================================================================
% -----------------------------    GET MOVE       ------------------------------
% ==============================================================================

% Gets the move from the player
get_move([Row,Column,Piece], Player) :-
    get_piece(Piece, Player),
    !,                              % Avoids showing wrong error mensagens
    get_row(Row),
    !,                              % Avoids showing wrong error mensagens
    get_column(Column),
    !.                              % Avoids showing wrong error mensagens

get_piece(Color_Piece, Player) :-
    ask_piece(Piece),
    check_piece(Piece),
    translate(Piece, Player, Color_Piece).

get_piece(Color_Piece, Player) :-
    piece_not_valid,
    get_piece(Color_Piece, Player).

get_row(Row) :-
    ask_row(Row),
    between(1, 4, Row).

get_row(Row) :-
    invalid_move,
    get_row(Row).

get_column(Column) :-
    ask_column(Column),
    between(1, 4, Column).

get_column(Column) :-
    invalid_column,
    get_column(Column).

% ===================================================================================
%                              GET NUM PLAYER
% To know if computer is player 1 or player 2. Necessary to check valid moves 
% and play pieces
% ===================================================================================
get_num_player(2, 3, 2).    % get_num_player(Mode, Computer_Player, Player),
get_num_player(3, 3, 1).
get_num_player(4, 3, 1).
get_num_player(4, 4, 2).
% less used, only to put the score in the rigth player
get_num_player(2, 1, 1).
get_num_player(1, Player, Player).
get_num_player(3, 2, 2).

% ========================================================================
% ---------------------------  BOARD UPDATES -----------------------------
% ========================================================================
move(Show_Error_Message, Move, Board, White_Pieces, Brown_Pieces, Player, New_Board, New_White_Pieces, New_Brown_Pieces) :-
    valid_move(Show_Error_Message, Move, Player, Board, White_Pieces, Brown_Pieces),
    move_piece(Move, Board, New_Board),
    remove_piece(Move, Player, White_Pieces, Brown_Pieces, New_White_Pieces, New_Brown_Pieces).

% Plays a Piece, get the new Board for Tabout Board
move_piece([Row,Column,Piece], Board, New_Board) :-
    update_row(Row, Column, Piece, Board, New_Board).

update_row(1, Column, Piece, [Row| More], [New_Row| More]):-
    update_column(Column, Piece, Row, New_Row).
update_row(N, Column, Piece, [Row| More], [Row| More_Rows]) :-
    N > 1, Next is N-1, update_row(Next, Column, Piece, More, More_Rows).

update_column(1, Piece, [_P | Rest], [Piece | Rest]).
update_column(N, Piece, [P | Rest], [P| More]) :-
    N > 1, Next is N-1, update_column(Next, Piece, Rest, More).

% Removes Piece form the white Pieces and BrownPieces available to play
remove_piece([_Row,_Column, Piece], 1, White_Pieces, Brown_Pieces, New_White_Pieces, Brown_Pieces) :-
    select(0, New_White_Pieces, Piece, White_Pieces).

remove_piece([_Row,_Column,Piece], 2, White_Pieces, Brown_Pieces, White_Pieces, New_Brown_Pieces) :-
    select(0, New_Brown_Pieces, Piece, Brown_Pieces).

% ========================================================================
% ----------------------  CHECK MOVES AVAILABLE  -------------------------
% Checks if there are any more moves available for the player
% ========================================================================
check_moves_available(Player, Board, White_Pieces, Brown_Pieces, _Mode, _Difficulty_Level, _Score1, _Score2) :-
    setof(Move, valid_move(0, Move, Player, Board, White_Pieces, Brown_Pieces), _List_Of_Moves).

% If there are no more moves available it's a tie
check_moves_available(_New_Player, _New_Board, _New_White_Pieces, _New_Brown_Pieces, Mode, Difficulty_Level, Score1, Score2) :-
    no_more_moves_message,
    get_interaction(Ans),
    playAgain(Ans, Mode, Difficulty_Level, Score1, Score2).      % ask if want to go back to main or play again

% ======================================================================
% --------------------------- TRANSLATIONS -----------------------------
% ======================================================================
% The play only writes the form and it is translated to the correct number to save in the board
% White pieces translate 
translate(cone, 1, 11). % form, number of player and number of the correspondent piece
translate(cube, 1, 51).
translate(cylinder, 1, 71).
translate(sphere, 1, 91).

% Brown pieces
translate(cone, 2, 12).
translate(cube, 2, 52).
translate(cylinder, 2, 72).
translate(sphere, 2, 92).
