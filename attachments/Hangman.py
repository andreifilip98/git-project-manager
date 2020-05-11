import random as random

# setup the words and hidden characters
words = [list("mancare"), list("bautura"), list("masina"), list("calculatoare"), list("telefon"), list("antivirus"), list("laptop"), list("ecran"), list("tastatura")]
hidden = []
nth_word = random.randrange(0, len(words)-1, 1)

word_as_a_list = str(words[nth_word]).strip('')
current_word = "".join(words[nth_word])

for character in words[nth_word]:
    hidden.append("_")

attempts = 0
max_attempts = 4

# loop until either the player has won or lost
isGameOver = False
while not isGameOver:

    # display the current board, guessed letters, and attempts remaining
    print(f"You have {max_attempts - attempts} attempts remaining")
    print(f"The current word is: {' '.join(hidden)}")

    print("     ------")
    print("     |    |")
    print("     |    " + ("O" if attempts > 0 else ""))
    print("     |    " + ("/\\" if attempts > 1 else ""))
    print("     |    " + ("|" if attempts > 2 else ""))
    print("     |    " + ("/\\" if attempts > 3 else ""))
    print(" -------- ")

    # ask the player for a character
    letterGuessed = input("Guess a letter: ")

    print('\n\n')
    print('===============================================')
    print('\n\n')

    if letterGuessed in words[nth_word]:
        # if the player guessed correct, show all matched letters and print message
        print(f"You guessed correctly! {letterGuessed} is in the letter")
        for i in range(len(words[nth_word])):
            character = words[nth_word][i]
            if character == letterGuessed:
                hidden[i] = words[nth_word][i]
                words[nth_word][i] = "_"
    else:
        # if player guessed wrong, print failure message and increment attempts
        print(f"You guessed wrong! {letterGuessed} is NOT in the word")
        attempts += 1

    # if the player has won print a win message and stop looping
    if all("_" == char for char in words[nth_word]):
    	print(f"{current_word} is in the word")
    	print("Congrats, you won!")
    	isGameOver = True

    # if the player has lost, print failing and stop looping
    if attempts > max_attempts:
        print("You lost!")
        isGameOver = True