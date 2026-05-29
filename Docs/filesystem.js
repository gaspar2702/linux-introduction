let currentLevelData = 0;
let currentPath = ["home", "student"];
let envVars = {};

// Entornos independientes por nivel
const environments = {
    0: { "home": { "student": { "readme": "FLAG{inicio_exitoso}" } } },
    1: { "home": { "student": { "-": "FLAG{lectura_de_guion}" } } },
    2: { "home": { "student": { "file with spaces": "FLAG{espacios_manejados}" } } },
    3: { "home": { "student": { ".hidden": "FLAG{archivos_ocultos}" } } },
    4: { "home": { "student": { "inhere": { "flag.txt": "FLAG{rutas_relativas}" } } } },
    5: { "home": { "student": { "data.txt": "texto basura\nmillionth FLAG{grep_salva_vidas}\nmas basura" } } },
    6: { "home": { "student": { "b64.txt": "RkxBR3tiYXNlNjRfZGVjb2RpZmljYWRvfQ==" } } },
    7: { "home": { "student": { "rev.txt": "}sart_la_otxet{GALF" } } },
    8: { "home": { "student": { "script.sh": "echo FLAG{scripts_basicos}" } } },
    9: { "home": { "student": { "ejecutable.sh": { type: "exec", content: "FLAG{ejecucion_local}", perms: "x" } } } },
    10: { "home": { "student": { "locked.sh": { type: "exec", content: "FLAG{permisos_chmod}", perms: "-" } } } },
    11: { "home": { "student": { "dir1": { "dir2": { "dir3": { "flag": "FLAG{explorador_find}" } } } } } },
    12: { "home": { "student": {} } }, // Flag in ENV
    13: { "home": { "student": { "pass.txt": "admin123" }, "admin": { "flag.txt": "FLAG{cambio_usuario}" } } },
    14: { "home": { "student": { "server_ip.txt": "192.168.1.100" } } }, // Simulation for SSH
    15: { "home": { "student": { "ports.txt": "Puerto abierto en 3000" } } } // Simulation for netcat
};

function initEnvironment(levelId) {
    currentLevelData = levelId;
    currentPath = ["home", "student"];
    envVars = levelId === 12 ? { "FLAG_VAR": "FLAG{variables_entorno}" } : {};
}

function getDir(pathArray) {
    let current = environments[currentLevelData];
    for (let i = 0; i < pathArray.length; i++) {
        if (!current || current[pathArray[i]] === undefined) return null;
        current = current[pathArray[i]];
    }
    return current;
}

function getPathString() {
    if (currentPath.join("/") === "home/student") return "~";
    return "/" + currentPath.join("/");
}
