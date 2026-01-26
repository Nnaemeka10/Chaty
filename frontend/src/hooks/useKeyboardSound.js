const keystrokeSounds = [
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),
];

function useKeyboardSound() {
    const playKeystrokeSound = () => {
        const soundIndex = Math.floor(Math.random() * keystrokeSounds.length);
        const sound = keystrokeSounds[soundIndex];
        sound.currentTime = 0;
        sound.play().catch((error) => {
            console.error("Error playing sound:", error);
        });
    };

    return { playKeystrokeSound };
}

export default useKeyboardSound;