function generateRandomGameCode() {
    let gameCode = "";

    const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 10);
        const randomDigit = possibleCharacters[randomIndex];
        code += randomDigit;
    }

    return gameCode;
};

export default generateRandomGameCode;