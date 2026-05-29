const BACKEND_URL = "https://script.google.com/macros/s/AKfycby5KhDXiU14ig-zYwXya-eWUC5afEEitedzfhOkEkcbzldawlFHzM6vEXa1DiKZJwad/exec"; 
let currentUser = "student";
let currentLevel = 0;
let userXP = 0;

const levels = [
    { title: "Nivel 0", obj: "Lee el archivo readme.", flag: "FLAG{inicio_exitoso}", hint: "Busca en Google: 'cómo leer o mostrar el contenido de un archivo en la terminal de Linux'." },
    { title: "Nivel 1", obj: "Lee el archivo llamado '-'.", flag: "FLAG{lectura_de_guion}", hint: "Busca en Google: 'how to read a file named dash in linux'." },
    { title: "Nivel 2", obj: "Lee el archivo con espacios.", flag: "FLAG{espacios_manejados}", hint: "Busca en Google: 'cómo leer un archivo con espacios en la terminal de Linux'." },
    { title: "Nivel 3", obj: "Encuentra el archivo oculto.", flag: "FLAG{archivos_ocultos}", hint: "Busca en Google: 'cómo listar archivos ocultos en Linux'." },
    { title: "Nivel 4", obj: "Explora la carpeta inhere.", flag: "FLAG{rutas_relativas}", hint: "Busca en Google: 'cómo cambiar de directorio o navegar entre carpetas en Linux'." },
    { title: "Nivel 5", obj: "Filtra la palabra 'millionth'.", flag: "FLAG{grep_salva_vidas}", hint: "Busca en Google: 'comando de Linux para buscar una palabra específica dentro de un archivo de texto'." },
    { title: "Nivel 6", obj: "Decodifica Base64.", flag: "FLAG{base64_decodificado}", hint: "Busca en Google: 'cómo decodificar texto en formato base64 desde la terminal de Linux'." },
    { title: "Nivel 7", obj: "Texto al revés.", flag: "FLAG{texto_al_reves}", hint: "Busca en Google: 'comando de Linux para invertir el orden de los caracteres en un archivo'." },
    { title: "Nivel 8", obj: "Lee el script.", flag: "FLAG{scripts_basicos}", hint: "Aplica el mismo comando que usaste en el Nivel 0 para ver qué contiene el script." },
    { title: "Nivel 9", obj: "Ejecuta el binario local.", flag: "FLAG{ejecucion_local}", hint: "Busca en Google: 'cómo ejecutar un script o binario que está en mi directorio actual en Linux'." },
    { title: "Nivel 10", obj: "Da permisos de ejecución y corre.", flag: "FLAG{permisos_chmod}", hint: "Busca en Google: 'cómo dar permisos de ejecución a un archivo en Linux'." },
    { title: "Nivel 11", obj: "Navega directorios anidados.", flag: "FLAG{explorador_find}", hint: "Combina lo que sabes para entrar a las carpetas una por una, o busca cómo ver el contenido de un archivo usando su ruta completa." },
    { title: "Nivel 12", obj: "Revisa el entorno.", flag: "FLAG{variables_entorno}", hint: "Busca en Google: 'comando para mostrar todas las variables de entorno en Linux'." },
    { title: "Nivel 13", obj: "Cambia de usuario.", flag: "FLAG{cambio_usuario}", hint: "Busca en Google: 'cómo cambiar a otro usuario en la terminal de Linux (substitute user)'." },
    { title: "Nivel 14", obj: "Conecta por SSH.", flag: "FLAG{conexion_ssh_exitosa}", hint: "Busca en Google: 'sintaxis básica para conectarse por SSH especificando usuario y dirección IP'." },
    { title: "Nivel 15", obj: "Conecta a un puerto local.", flag: "FLAG{netcat_master}", hint: "Busca en Google: 'cómo usar el comando nc (netcat) para conectarse a localhost en un puerto específico'." }
];

function loadLevel(levelIndex) {
    if (!levels[levelIndex]) return printToTerminal("\n[!] CTF COMPLETADO. ¡Felicidades!");
    
    currentLevel = levelIndex;
    initEnvironment(levelIndex);
    document.getElementById("prompt-text").textContent = "student@ctf:~$";
    
    const level = levels[levelIndex];
    document.getElementById("level-title").textContent = level.title;
    document.getElementById("level-objective").textContent = level.obj;
    document.getElementById("hint-text").textContent = level.hint;
    document.getElementById("hint-text").classList.add("hidden");
    
    printToTerminal(`\n--- Entorno listo: Iniciando ${level.title} ---`);
}

function showHint() {
    document.getElementById(`hint-text`).classList.remove("hidden");
}

function avanzarNivel() {
    userXP += 100;
    document.getElementById("xp-display").textContent = userXP;
    loadLevel(currentLevel + 1);
}

function saveProgress(flag) {
    printToTerminal("\n[SISTEMA] ¡Flag detectada! Guardando...", false);
    
    fetch(BACKEND_URL, {
        method: "POST",
        body: JSON.stringify({ user: currentUser, level: currentLevel, flag: flag })
    })
    .then(response => response.text())
    .then(() => avanzarNivel())
    .catch(() => {
        printToTerminal("[SISTEMA] Error de red. Avanzando localmente.", false);
        avanzarNivel();
    });
}

document.addEventListener('commandExecuted', (e) => {
    const output = e.detail.output;
    const currentFlag = levels[currentLevel]?.flag;
    if (currentFlag && output && output.includes(currentFlag)) {
        saveProgress(currentFlag);
    }
});

loadLevel(0);
