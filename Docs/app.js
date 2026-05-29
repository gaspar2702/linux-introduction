// URL de tu Google Apps Script (Web App)
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyHTJyoz05gdQ5HiuDOmoGf6pmXaDTzHohpeOlDX8_l0SqjCR6Tu4vt58BYNOWPt0JN/exec"; 
let currentUser = "student";
let currentLevel = 0;
let userXP = 0;

const levels = [
    {
        id: 0,
        title: "Nivel 0 — Introducción",
        objective: "Encuentra la flag oculta en la carpeta 'secretos'. Usa 'ls', 'cd' y 'cat'.",
        flag: "FLAG{bienvenido_linux}",
        hint: "Usa 'ls' para ver las carpetas. Usa 'cd secretos' para entrar. Luego 'cat flag.txt'."
    },
    {
        id: 1,
        title: "Nivel 1 — Búsqueda en Logs",
        objective: "Encuentra la contraseña en el archivo server.log dentro de la carpeta 'logs'.",
        flag: "FLAG{grep_master}",
        hint: "Ve a la carpeta 'logs' y usa 'cat server.log' o 'grep FLAG server.log'."
    }
];

function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    if (!level) return printToTerminal("\n¡Felicidades! Has completado la academia.");
    
    currentLevel = levelIndex;
    document.getElementById("level-title").textContent = level.title;
    document.getElementById("level-objective").textContent = `Objetivo: ${level.objective}`;
    document.getElementById("hint-1-text").textContent = level.hint;
    document.getElementById("hint-1-text").classList.add("hidden");
    
    printToTerminal(`\n--- Iniciando ${level.title} ---`);
}

function showHint(num) {
    document.getElementById(`hint-1-text`).classList.remove("hidden");
}

async function saveProgress(flag) {
    printToTerminal("[SISTEMA] Guardando progreso en la nube...", false);
    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            mode: "no-cors", // Requerido para Apps Script sin config CORS compleja
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: currentUser,
                level: currentLevel,
                flag: flag
            })
        });
        
        userXP += 100;
        document.getElementById("xp-display").textContent = userXP;
        printToTerminal("[SISTEMA] Progreso guardado correctamente.\n", false);
        loadLevel(currentLevel + 1);
        
    } catch (error) {
        printToTerminal("[SISTEMA] Error guardando progreso. Pasando al siguiente nivel localmente.\n", false);
        loadLevel(currentLevel + 1);
    }
}

document.addEventListener('commandExecuted', (e) => {
    const output = e.detail.output;
    const currentFlag = levels[currentLevel]?.flag;
    
    if (currentFlag && output.includes(currentFlag)) {
        printToTerminal(`\n[!] FLAG ENCONTRADA: ${currentFlag}`);
        saveProgress(currentFlag);
    }
});

// Iniciar aplicación
loadLevel(0);
