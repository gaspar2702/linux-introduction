const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

function printToTerminal(text, isCommand = false) {
    const div = document.createElement("div");
    if (isCommand) {
        div.innerHTML = `<span class="prompt">student@linux-ctf:${getPathString()}$</span> ${text}`;
    } else if (text) {
        div.textContent = text;
    }
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const input = terminalInput.value;
        printToTerminal(input, true);
        
        const output = executeCommand(input);
        if (output) printToTerminal(output);
        
        terminalInput.value = "";
        
        // Disparar evento para que app.js evalúe si se encontró una flag
        document.dispatchEvent(new CustomEvent('commandExecuted', { 
            detail: { output: output } 
        }));
    }
});
