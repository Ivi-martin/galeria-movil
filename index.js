document.addEventListener('DOMContentLoaded', () => {
    const imageElement = document.getElementById('current-image');
    const imageFrame = document.getElementById('image-frame');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // --- Configuración de la Galería ---
    const totalImages = 5; // Asume que tienes 1.jpg, 2.jpg, ..., 5.jpg
    let currentImageIndex = 1;

    function updateImage() {
        // Cambia la fuente de la imagen
        imageElement.src = `${currentImageIndex}.jpg`;

        // Actualiza el estado de los botones (desactiva en los límites)
        prevBtn.disabled = currentImageIndex === 1;
        nextBtn.disabled = currentImageIndex === totalImages;
    }

    // Navegación con botones
    prevBtn.addEventListener('click', () => {
        if (currentImageIndex > 1) {
            currentImageIndex--;
            updateImage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentImageIndex < totalImages) {
            currentImageIndex++;
            updateImage();
        }
    });

    // Inicializa la galería
    updateImage();

    // --- 1. Eventos de Orientación del Dispositivo (Rotación) ---
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            
            // Ángulos de orientación del dispositivo:
            // alpha: Rotación alrededor del eje Z (360º, rotación plana)
            // beta: Inclinación de adelante hacia atrás (eje X, -180º a 180º)
            // gamma: Inclinación de izquierda a derecha (eje Y, -90º a 90º)
            
            // Usamos los ángulos para la transformación 3D
            const alpha = event.alpha; 
            const beta = event.beta;
            const gamma = event.gamma;

            // La primera parte del ejercicio pedía solo el ángulo alpha para rotar
            // imageElement.style.transform = `rotate(${alpha}deg)`;
            
            // Aplicamos la transformación 3D (beta/gamma para inclinación, alpha para rotación)
            // Usamos imageFrame para aplicar la transformación, no solo la imagen
            imageElement.style.transform = `
                perspective(800px) 
                rotateX(${beta}deg) 
                rotateY(${gamma}deg)
                rotateZ(${-alpha}deg)
            `;

            // Nota: Se usa -alpha para que la rotación parezca seguir el dispositivo
            
        }, true);
    } else {
        console.warn("DeviceOrientationEvent no está soportado en este navegador/dispositivo.");
    }
    
    // --- 2. Integración con Hammer.js (Gestos Pan) ---
    // Captura el elemento que recibirá los gestos (el contenedor de la imagen)
    const hammertime = new Hammer(imageFrame);

    // Detección de gestos 'panleft' y 'panright' (deslizamiento)
    hammertime.on('panright', (event) => {
        // Solo actúa si es un deslizamiento significativo
        if (event.isFinal) {
            if (currentImageIndex > 1) {
                currentImageIndex--;
                updateImage();
            }
        }
    });

    hammertime.on('panleft', (event) => {
        // Solo actúa si es un deslizamiento significativo
        if (event.isFinal) {
            if (currentImageIndex < totalImages) {
                currentImageIndex++;
                updateImage();
            }
        }
    });
    
    // Evita el comportamiento de arrastre por defecto en algunos navegadores
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    
});