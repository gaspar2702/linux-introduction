const fileSystem = {
    "home": {
        "student": {
            "documentos": {},
            "secretos": {
                "flag.txt": "FLAG{bienvenido_linux}"
            },
            "logs": {
                "server.log": "User admin logged in\nError 404\nPassword for backup: FLAG{grep_master}\nConnection closed"
            }
        }
    }
};

let currentPath = ["home", "student"];

function getDir(pathArray) {
    let current = fileSystem;
    for (let i = 0; i < pathArray.length; i++) {
        if (current[pathArray[i]] === undefined) return null;
        current = current[pathArray[i]];
    }
    return current;
}

function getPathString() {
    return "/" + currentPath.join("/");
}
