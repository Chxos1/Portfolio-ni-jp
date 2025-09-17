document.addEventListener("DOMContentLoaded", function () {
    function runTypewriter(elementId, texts, typingSpeed = 100, deletingSpeed = 100) {
        const element = document.getElementById(elementId);
        if (!element) return; // Stop if ID not found

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentText = texts[textIndex];

            if (!isDeleting) {
                element.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="typewriter-cursor">|</span>';
                charIndex++;
                if (charIndex === currentText.length) {
                    isDeleting = true; // immediately start deleting
                }
            } else {
                element.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="typewriter-cursor">|</span>';
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                }
            }
            setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
        }

        typeEffect();
    }
    
    runTypewriter("typewriter", ["I'm a Frontend Developer"]);
})