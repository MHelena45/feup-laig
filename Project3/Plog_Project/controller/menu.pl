% ========================================================================
% --------------------------- MENU ---------------------------------------
% =========================================================================

main_menu(Mode, Difficulty_Level) :-
    print_main_menu,
    ask_menu_option(Option),
    manage_option(Option, Mode, Difficulty_Level).

% =============================================================================
%   Deals with the inputs of the player in any menu
% =============================================================================

% Person vs Person
manage_option('1', 1, _Level).

% Person vs Computer
manage_option('2', 2, Level) :-
    print_level_menu,
    get_level(Level).

% Computer vs Person
manage_option('3', 3, Level) :-
    print_level_menu, 
    get_level(Level).

% Computer vs Computer
manage_option('4', 4, Level) :-
    print_level_menu, 
    get_level(Level).

% Help menu
manage_option('5', _, _) :-
    print_help_menu,
    press_any_button,
    play.

% Exit
manage_option('0', _ , _) :-
    exiting_message,
    break. % Stops executation

% deals with invalid option
manage_option(_Other) :-
    invalid_option_message,
    ask_menu_option(Option),
    manage_option(Option).

get_level(Level) :-
    repeat,
    ask_level(Level),
    valid_level(Level).

get_level(_Level) :-        % if level introduce isn't valid (=!= (1 || 2 || 3))
    invalid_level_message,    % error mensage is shown
    fail.                     % fails and repeats process again

% Levels can be 1, 2 or 3
valid_level(1).
valid_level(2).
valid_level(3).
