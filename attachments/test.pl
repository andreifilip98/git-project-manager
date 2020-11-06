
:- dynamic(masina/2).
masina(mercedes, 2000).
masina(bmw, 2005).
masina(dacia, 2013).
masina(renault, 2010).


eval(1) :- 
	write('Enter car name: \n'),
	read(C),
	write('Enter car year: \n'),
	read(Y),
	not(masina(C, Y)),
	assertz(masina(C, Y)).

eval(2) :- 
	write('Cars: \n'),
	findall(masina(X, Y), masina(X, Y), R),
    write('\nCars:'),
    write('\n'),
    write(R),
    write('\n').

eval(3) :- 
	write('Which car do you want to delete? \n'),
	write('Name: '),
	read(N),
	write('Year: '),
	read(Y),
	masina(N, Y),
	retract(masina(N, Y)).

meniu :- 
	write('Alege o optiune: \n'),
	write('1. Add car \n'),
	write('2. Show cars \n'),
	write('3. Delete car \n'),
	read(X),
	eval(X).