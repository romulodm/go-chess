export default function playMoveSound() {
    let moveSound = new Audio("./sounds/Move.mp3");
    let playMove = moveSound.play();
    if (playMove !== undefined) {
        playMove
            .then(function () {})
            .catch(function (error) {
                console.log("Failed to load capture sound");
            });
    }
};