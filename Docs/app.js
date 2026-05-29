const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwKNxAeiwnCbfPzzJU2y7McEPvmthrPXRiQbwn3FnJ3s9tuym_ed8LNx82DclE0__7x/exec"; 
let currentUser = "student";
let currentLevel = 0;
let userXP = 0;

const levels = [
    { title: "Nivel 0", obj: "Lee el archivo readme.", flag: "FLAG{inicio_exitoso}", hint: "Usa cat readme" },
    { title: "Nivel 1", obj: "Lee el archivo llamado '-'.", flag: "FLAG{lectura_de_guion}", hint: "Usa cat ./-" },
    { title: "Nivel 2", obj: "Lee el archivo con espacios.", flag: "FLAG{espacios_manejados}", hint: "Usa cat \"file with spaces\"" },
    { title: "Nivel 3", obj: "Encuentra el archivo oculto.", flag: "FLAG{archivos_ocultos}", hint: "Usa ls -a y cat" },
    { title: "Nivel 4", obj: "Explora la carpeta inhere.", flag: "FLAG{rutas_relativas}", hint: "Usa cd inhere y luego cat" },
    { title: "Nivel 5", obj: "Filtra la palabra 'millionth'.", flag: "FLAG{grep_salva_vidas}", hint: "Usa grep millionth data.txt" },
    { title: "Nivel 6", obj: "Decodifica Base64.", flag: "FLAG{base64_decodificado}", hint: "Usa base64 -d b64.txt" },
    { title: "Nivel 7", obj: "Texto al revés.", flag: "FLAG{texto_al_reves}", hint: "Usa rev rev.txt" },
    { title: "Nivel 8", obj: "Lee el script.", flag: "FLAG{scripts_basicos}", hint: "Usa cat script.sh" },
    { title: "Nivel 9", obj: "Ejecuta el binario local.", flag: "FLAG{ejecucion_local}", hint: "Usa ./ejecutable.sh" },
    { title: "Nivel 10", obj: "Da permisos de ejecución y corre.", flag: "FLAG{permisos_chmod}", hint: "chmod +x locked.sh y luego ./" },
    { title: "Nivel 11", obj: "Navega directorios anidados.", flag: "FLAG{explorador_find}", hint: "Usa cd repetidamente" },
    { title: "Nivel 12", obj: "Revisa el entorno.", flag: "FLAG{variables_entorno}", hint: "Usa env" },
    { title: "Nivel 13", obj: "Cambia de usuario.", flag: "FLAG{cambio_usuario}", hint: "Lee pass.txt, usa su admin, lee flag.txt" },
    { title: "Nivel 14", obj: "Conecta por SSH.", flag: "FLAG{conexion_ssh_exitosa}", hint: "Lee server_ip.txt, usa ssh admin@IP" },
    { title: "Nivel 15", obj: "Conecta a un puerto local.", flag: "FLAG{netcat_master}", hint: "Lee ports.txt, usa nc localhost PUERTO" }
];

function loadLevel(levelIndex) {
    if (!levels[levelIndex]) return printToTerminal("\n¡CTF COMPLETADO!");
    
    currentLevel = levelIndex;
    initEnvironment(levelIndex); // Carga el sistema de archivos del nivel
    document.getElementById("prompt-text").textContent = "student@ctf:~$";
    
    const level = levels[levelIndex];
    document.getElementById("level-title").textContent = level.title;
    document.getElementById("level-objective").textContent = level.obj;
    document.getElementById("hint-text").textContent = level.hint;
    document.getElementById("hint-text").classList.add("hidden");
    
    printToTerminal(`\n--- Entorno reiniciado: Iniciando ${level.title} ---`);
}

function showHint() {
    document.getElementById(`hint-text`).classList.remove("hidden");
}

async function saveProgress(flag) {
    printToTerminal("[SISTEMA] Verificando flag online...", false);
    try {
        await fetch(BACKEND_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ user: currentUser, level: currentLevel, flag: flag })
        });
        
        userXP += 100;
        document.getElementById("xp-display").textContent = userXP;
        printToTerminal("[SISTEMA] ¡Correcto! Progreso guardado.\n", false);
        loadLevel(currentLevel + 1);
        
    } catch (error) {
        printToTerminal("[SISTEMA] Guardado offline.\n", false);
        loadLevel(currentLevel + 1);
    }
}

document.addEventListener('commandExecuted', (e) => {
    const output = e.detail.output;
    const currentFlag = levels[currentLevel]?.flag;
    if (currentFlag && output.includes(currentFlag)) {
        saveProgress(currentFlag);
    }
});

loadLevel(0);
