% =========================================================================================
%      Board, Pieces of the players available ( 2 of wich form availabe in the begining )
% =========================================================================================

init_board([
    [0, 0, 0, 0],         % 0 represents a empty cell
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]).

init_white_pieces([
    11, 11,     % white cones are represented by 11 and there are 2 available in the start
    51, 51,     % white cubes are represented by 51 and there are 2 available in the start
    71, 71,     % white cylinders are represented by 71 and there are 2 available in the start
    91, 91      % white spheres are represented by 91 and there are 2 available in the start
]).

init_brown_pieces([
    12, 12,     % brown cones are represented by 12 and there are 2 available in the start
    52, 52,     % brown cubes are represented by 52 and there are 2 available in the start
    72, 72,     % brown cylinders are represented by 72 and there are 2 available in the start
    92, 92      % brown spheres are represented by 92 and there are 2 available in the start
]).
