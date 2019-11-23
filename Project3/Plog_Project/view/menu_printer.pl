% ========================================================================
% --------------------------- ALl MENUS   --------------------------------
% =========================================================================


% ==============================================================================================
%    Draws menus
% ==============================================================================================

print_main_menu :-
    clear_screen,
    nl,
    print_welcome_message,
    print_options,
    print_footer.

print_level_menu :-
    clear_screen,
    nl,
    print_game_name,
    print_difficulty_options,
    print_footer.

print_congratulations(Player, Score1, Score2) :-
    print_game_name,
    print_congratulations_message(Player, Score1, Score2), 
    print_footer.

print_congratulations(Score1, Score2) :-
    print_game_name,
    print_congratulations_message(Score1, Score2), 
    print_footer.

print_computer_congratulations(Computer_Player, Score1, Score2) :-
    print_game_name,
    print_computer_congratulations_message(Computer_Player, Score1, Score2),
    print_footer.

print_sorry(Score1, Score2) :-
    print_game_name,
    print_sorry_message(Score1, Score2),
    print_footer.

print_welcome_message :-
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|                        Welcome to Quantik!!                           |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_options :-
    write('|=======================================================================|'),nl,
    write('|       Your Options:                                                   |'),nl,
    write('|                                                                       |'),nl,
    write('|                          1. Player vs Player                          |'),nl,
    write('|                                                                       |'),nl,
    write('|                          2. Player vs Computer                        |'),nl,
    write('|                                                                       |'),nl,
	write('|                          3. Computer vs Player                        |'),nl,
    write('|                                                                       |'),nl,
    write('|                          4. Computer vs Computer                      |'),nl,
    write('|                                                                       |'),nl,
    write('|                          5. help                                      |'),nl,
    write('|                                                                       |'),nl,
    write('|                          0. Exit                                      |'),nl,
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_footer :-
    write('|=======================================================================|'),nl,
    write('|       Made by:                                                        |'),nl,
    write('|                          Gaspar Santos Pinheiro                       |'),nl,
    write('|                          Maria Helena Ferreira                        |'),nl,
    write('|_______________________________________________________________________| '),nl,nl,nl.

print_game_name :-
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|                               Quantik                                 |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_difficulty_options :-
    write('|=======================================================================|'),nl,
    write('|      Choose level of difficulty:                                      |'),nl,
    write('|                                                                       |'),nl,
    write('|           Press 1 - level 1                                           |'),nl,
    write('|                                                                       |'),nl,
    write('|           Press 2 - level 2                                           |'),nl,
    write('|                                                                       |'),nl,
	write('|           Press 3 - level 3                                           |'),nl,
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________| '),nl,nl,nl.

% both score are lower than 10
print_score(Score1, Score2) :-
    Score1 < 10, Score2 < 10,
    write('|                          Score: '),
    write(Score1),
    write(' - '), 
    write(Score2),
    write('                                 |'),nl.

% if one score is greater than 9, we have to reduce a space
print_score(Score1, Score2) :-
    write('|                         Score: '),
    write(Score1),
    write(' - '), 
    write(Score2),
    write('                                 |'),nl.

print_congratulations_message(Player, Score1, Score2) :-
    write('|=======================================================================|'),nl,
    write('|                                                                       |'),nl,
    write('|                    Congratulations, player '), write(Player),
    write('                          |'),nl,
    write('|                                                                       |'),nl,
    print_score(Score1, Score2),
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_congratulations_message(Score1, Score2) :-  
    write('|=======================================================================|'),nl,
    write('|                                                                       |'),nl,
    write('|           Congratulations, you win against the computer!              |'),nl,
    write('|                                                                       |'),nl,
    print_score(Score1, Score2),
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_computer_congratulations_message(Player, Score1, Score2) :-
    write('|=======================================================================|'),nl,
    write('|                                                                       |'),nl,
    write('|                        Computer '), write(Player),              
    write(' wins!!                              |'),nl,
    write('|                                                                       |'),nl,
    print_score(Score1, Score2),
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_sorry_message(Score1, Score2) :-  
    write('|=======================================================================|'),nl,
    write('|                                                                       |'),nl,
    write('|                    The Computer won this time!!                       |'),nl,
    write('|                                                                       |'),nl,
    print_score(Score1, Score2),
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________|'),nl.

print_help_menu :-
    clear_screen,
    nl,
    write(' _________________________________________________________________________'),nl,
    write('|                                                                         |'),nl,
    write('|                       Rules of Quantik                                  |'),nl,
    write('|                                                                         |'),nl,
    write('| -At each turn, players alternately place one of their pieces on the     |'),nl,
    write('|   board.                                                                |'),nl,
    write('|                                                                         |'),nl,
    write('|                                                                         |'),nl,
    write('| -When placing a piece on the board, each player must adhere to the      |'),nl,
    write('| following rule: It is not allowed to place a piece in a special column, |'),nl, 
    write('| row or zone in which the opponent has already placed a piece in the     |'),nl,
    write('| same way. A zone is any of the four squares formed at the ends of the   |'),nl,
    write('| board.An example of a square being formed by the 4 positions(1,1),      |'),nl,
    write('| (1,2), (2,1) and (2,2).                                                 |'),nl,
    write('|                                                                         |'),nl,
    write('|_________________________________________________________________________| '),nl,nl,nl.