const commands = {
    help: () => `Comandos: pwd, ls, cd, cat, grep, base64, rev, chmod, ./, env, su, ssh, nc, clear`,
    pwd: () => currentPath.join("/") === "home/student" ? "/home/student" : "/" + currentPath.join("/"),
    clear: () => { document.getElementById("terminal-output").innerHTML = ""; return ""; },
    
    ls: (args) => {
        const showHidden = args.includes("-a");
        const dir = getDir(currentPath);
        if (typeof dir !== "object" || dir.type === "exec") return "ls: no es un directorio";
        return Object.keys(dir)
            .filter(file => showHidden || !file.startsWith("."))
            .join("  ");
    },
    
    cd: (args) => {
        let target = args[0] || "~";
        if (target === "~") { currentPath = ["home", "student"]; return ""; }
        if (target === "..") { if (currentPath.length > 1) currentPath.pop(); return ""; }
        
        const dir = getDir(currentPath);
        if (dir[target] && typeof dir[target] === "object" && !dir[target].type) {
            currentPath.push(target);
            return "";
        }
        return `cd: ${target}: No existe o no es un directorio`;
    },
    
    cat: (args) => {
        if (!args[0]) return "cat: falta operando";
        let target = args[0];
        if (target === "./-") target = "-"; 
        
        const dir = getDir(currentPath);
        const file = dir[target];
        
        if (!file) return `cat: ${target}: No existe`;
        if (typeof file === "object" && !file.type) return `cat: ${target}: Es un directorio`;
        return file.type === "exec" ? "Binario o script no legible directamente" : file;
    },

    grep: (args) => {
        if (args.length < 2) return "grep: uso: grep <patron> <archivo>";
        const dir = getDir(currentPath);
        const file = dir[args[1]];
        if (!file || typeof file === "object") return "";
        return file.split("\n").filter(l => l.includes(args[0])).join("\n");
    },

    base64: (args) => {
        if (args[0] !== "-d" || !args[1]) return "uso: base64 -d <archivo>";
        const file = getDir(currentPath)[args[1]];
        if (!file) return "";
        try { return atob(file); } catch { return "Error decodificando"; }
    },

    rev: (args) => {
        const file = getDir(currentPath)[args[0]];
        if (!file) return "";
        return file.split("").reverse().join("");
    },

    chmod: (args) => {
        if (args[0] === "+x" && args[1]) {
            const dir = getDir(currentPath);
            if (dir[args[1]] && dir[args[1]].type === "exec") {
                dir[args[1]].perms = "x";
                return "";
            }
        }
        return "chmod fallido";
    },

    env: () => Object.entries(envVars).map(([k, v]) => `${k}=${v}`).join("\n"),

    su: (args) => {
        if (args[0] === "admin" && currentLevelData === 13) {
            currentPath = ["home", "admin"];
            document.getElementById("prompt-text").textContent = "admin@ctf:~$";
            return "Cambiado a usuario admin";
        }
        return "Autenticación fallida";
    },

    ssh: (args) => {
        if (args[0] === "admin@192.168.1.100" && currentLevelData === 14) {
            return "FLAG{conexion_ssh_exitosa}";
        }
        return "Connection refused";
    },

    nc: (args) => {
        if (args[0] === "localhost" && args[1] === "3000" && currentLevelData === 15) {
            return "Conectado. FLAG{netcat_master}";
        }
        return "nc: connect to localhost port failed";
    }
};

function executeCommand(input) {
    const argsMatch = input.match(/(?:[^\s"]+|"[^"]*")+/g);
    if (!argsMatch) return "";
    
    const parts = argsMatch.map(arg => arg.replace(/^"|"$/g, ''));
    const cmd = parts[0];
    const args = parts.slice(1);

    if (cmd.startsWith("./")) {
        const scriptName = cmd.replace("./", "");
        const file = getDir(currentPath)[scriptName];
        if (file && file.type === "exec" && file.perms === "x") return file.content;
        return `bash: ${cmd}: Permiso denegado o no encontrado`;
    }

    if (commands[cmd]) return commands[cmd](args);
    return `${cmd}: orden no encontrada`;
}
