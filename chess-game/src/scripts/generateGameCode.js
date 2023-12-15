function generateRandomGameCode() {
    let gameCode = "";

    const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * 36);
        const randomDigit = possibleCharacters[randomIndex];
        gameCode += randomDigit;
    }

    return gameCode;
};

export default generateRandomGameCode;