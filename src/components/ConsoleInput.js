import { Textarea, VStack } from "@chakra-ui/react";

export function ConsoleInput({ command, setCommand, scrollToBottom, sendInput }) {
    return (
        <VStack>
            <Textarea
                autoFocus
                spellCheck={false}
                rows={6}
                placeholder={`Type your console command here and press |Shift|+|Enter| to send it to Starfield${String.fromCharCode(10)}You can use |Ctrl|+|Alt|+|DownArrow| to scroll the output to current`}
                value={command}
                onChange={e => setCommand(e.target.value)}
                onKeyDown={e => {
                    if (e.shiftKey && e.key === "Enter") {
                        e.preventDefault();
                        const cmd = command;
                        setCommand("");
                        sendInput(cmd);
                    }
                    else if (e.ctrlKey && e.altKey && e.key === "ArrowDown") {
                        e.preventDefault();
                        scrollToBottom();
                    }
                }}
            />
        </VStack>
    );
}
