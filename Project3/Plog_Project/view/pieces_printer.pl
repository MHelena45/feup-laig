
% Empty simbol
print_piece(0, _) :-     write('...............').

% ------------------ WHITE PIECES -------------------
% Cone
print_piece(11, 2) :-    write('      /\\       ').
print_piece(11, 3) :-    write('     /  \\      ').
print_piece(11, 4) :-    write('    /    \\     ').
print_piece(11, 5) :-    write('   /  WW  \\    ').
print_piece(11, 6) :-    write('  /  WWWW  \\   ').
print_piece(11, 7) :-    write(' /  WWWWWW  \\  ').
print_piece(11, 8) :-    write('/  WWWWWWWW  \\ ').
print_piece(11, 9) :-    write('"-._______.-"  ').
print_piece(11, _) :-    write('               ').

% Cube
print_piece(51, 2) :-    write('    +--------+ ').
print_piece(51, 3) :-    write('   /  WWWW  /| ').
print_piece(51, 4) :-    write('  /  WWWW  / | ').
print_piece(51, 5) :-    write(' +--------+  | ').
print_piece(51, 6) :-    write(' |  WWWW  |  | ').
print_piece(51, 7) :-    write(' |  WWWW  | /  ').
print_piece(51, 8) :-    write(' |  WWWW  |/   ').
print_piece(51, 9) :-    write(' +--------+    ').
print_piece(51, _) :-    write('               ').

% Cylinder
print_piece(71, 2) :-    write('   _.-----._   ').
print_piece(71, 3) :-    write(' .-  WWWWW  -. ').
print_piece(71, 4) :-    write(' |-_  WWW  _-| ').
print_piece(71, 5) :-    write(' |  ~-----~  | ').
print_piece(71, 6) :-    write(' |  WWWWWWW  | ').
print_piece(71, 7) :-    write(' |  WWWWWWW  | ').
print_piece(71, 8) :-    write(' "._       _." ').
print_piece(71, 9) :-    write('    "-----"    ').
print_piece(71, _) :-    write('               ').

% Sphere
print_piece(91, 3) :-    write('      ____     ').
print_piece(91, 4) :-    write('    .W+.   .   ').
print_piece(91, 5) :-    write('  WWw++-..   . ').
print_piece(91, 6) :-    write('  WWWW++--..  .').
print_piece(91, 7) :-    write('  "WWWww+++--" ').
print_piece(91, 8) :-    write('    "WWWwww"   ').
print_piece(91, 9) :-    write('       ""      ').
print_piece(91, _) :-    write('               ').

% ------------------ BROWN PIECES -------------------
% Cone
print_piece(12, 2) :-    write('      /\\       ').
print_piece(12, 3) :-    write('     /  \\      ').
print_piece(12, 4) :-    write('    /    \\     ').
print_piece(12, 5) :-    write('   /  BB  \\    ').
print_piece(12, 6) :-    write('  /  BBBB  \\   ').
print_piece(12, 7) :-    write(' /  BBBBBB  \\  ').
print_piece(12, 8) :-    write('/  BBBBBBBB  \\ ').
print_piece(12, 9) :-    write('"-._______.-"  ').
print_piece(12, _) :-    write('               ').

% Cube
print_piece(52, 2) :-    write('    +--------+ ').
print_piece(52, 3) :-    write('   /  BBBB  /| ').
print_piece(52, 4) :-    write('  /  BBBB  / | ').
print_piece(52, 5) :-    write(' +--------+  | ').
print_piece(52, 6) :-    write(' |  BBBB  |  | ').
print_piece(52, 7) :-    write(' |  BBBB  | /  ').
print_piece(52, 8) :-    write(' |  BBBB  |/   ').
print_piece(52, 9) :-    write(' +--------+    ').
print_piece(52, _) :-    write('               ').

% Cylinder
print_piece(72, 2) :-    write('   _.-----._   ').
print_piece(72, 3) :-    write(' .-  BBBBB  -. ').
print_piece(72, 4) :-    write(' |-_  BBB  _-| ').
print_piece(72, 5) :-    write(' |  ~-----~  | ').
print_piece(72, 6) :-    write(' |  BBBBBBB  | ').
print_piece(72, 7) :-    write(' |  BBBBBBB  | ').
print_piece(72, 8) :-    write(' "._       _." ').
print_piece(72, 9) :-    write('    "-----"    ').
print_piece(72, _) :-    write('               ').

% Sphere
print_piece(92, 3) :-    write('      ____     ').
print_piece(92, 4) :-    write('    .B+.   .   ').
print_piece(92, 5) :-    write('  BBb++-..   . ').
print_piece(92, 6) :-    write('  BBBB++--..  .').
print_piece(92, 7) :-    write('  "BBBbb+++--" ').
print_piece(92, 8) :-    write('    "BBBbbb"   ').
print_piece(92, 9) :-    write('       ""      ').
print_piece(92, _) :-    write('               ').
