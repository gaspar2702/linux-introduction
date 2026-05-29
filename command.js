const commands = {
    help: () => `Comandos disponibles:\nhelp  - Muestra este mensaje\npwd   - Muestra el directorio actual\nls    - Lista archivos y directorios\ncd    - Cambia de directorio\ncat   - Lee el contenido de un archivo\nclear - Limpia la terminal`,
    
    pwd: () => getPathString(),
    
    clear: () => {
        document.getElementById("terminal-output").innerHTML = "";
        return "";
    },
    
    ls: (args) => {
        const dir = getDir(currentPath);
        if (typeof dir === "string") return "ls: no se puede leer el directorio";
        return Object.keys(dir).join("  ");
    },
    
    cd: (args) => {
        if (!args[0] || args[0] === "~") {
            currentPath = ["home", "student"];
            return "";
        }
        if (args[0] === "..") {
            if (currentPath.length > 0) currentPath.pop();
            return "";
        }
        
        const target = args[0];
        const dir = getDir(currentPath);
        
        if (dir[target] !== undefined && typeof dir[target] === "object") {
            currentPath.push(target);
            return "";
        } else if (typeof dir[target] === "string") {
            return `cd: ${target}: No es un directorio`;
        } else {
            return `cd: ${target}: No existe el archivo o el directorio`;
        }
    },
    
    cat: (args) => {
        if (!args[0]) return "cat: falta operando";
        const dir = getDir(currentPath);
        const file = dir[args[0]];
        
        if (file === undefined) return `cat: ${args[0]}: No existe el archivo o el directorio`;
        if (typeof file === "object") return `cat: ${args[0]}: Es un directorio`;
        return file;
    },

    grep: (args) => {
        if (args.length < 2) return "grep: falta operando";
        const term = args[0];
        const fileName = args[1];
        
        const dir = getDir(currentPath);
        const file = dir[fileName];
        
        if (file === undefined) return `grep: ${fileName}: No existe el archivo`;
        if (typeof file === "object") return `grep: ${fileName}: Es un directorio`;
        
        const lines = file.split("\n");
        const match = lines.filter(line => line.includes(term));
        return match.join("\n");
    }
};

function executeCommand(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    if (commands[cmd]) {
        return commands[cmd](args);
    } else if (cmd) {
        return `${cmd}: orden no encontrada`;
    }
    return "";
}