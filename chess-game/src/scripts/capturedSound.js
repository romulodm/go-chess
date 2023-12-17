export default function playCaptureSound() {
    let captureSound = new Audio("./sounds/Capture.mp3");
    let playMove = captureSound.play();
    if (playMove !== undefined) {
        playMove
            .then(function () {})
            .catch(function (error) {
                console.log("Failed to load capture sound");
            });
    }
};