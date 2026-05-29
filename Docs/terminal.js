const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

function printToTerminal(text, isCommand = false) {
    const div = document.createElement("div");
    if (isCommand) {
        div.innerHTML = `<span class="prompt">${document.getElementById("prompt-text").textContent}</span> ${text}`;
    } else if (text) {
        div.textContent = text;
    }
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const input = terminalInput.value;
        if (!input.trim()) return;
        
        printToTerminal(input, true);
        const output = executeCommand(input);
        if (output) printToTerminal(output);
        
        terminalInput.value = "";
        document.dispatchEvent(new CustomEvent('commandExecuted', { detail: { output: output } }));
    }
});
