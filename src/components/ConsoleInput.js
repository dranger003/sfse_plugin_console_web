import { Icon, IconButton, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";

export function ConsoleInput({ command, setCommand, scrollToBottom, sendInput }) {
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [manualEdit, setManualEdit] = useState(false);

    useEffect(() => {
        setHistoryIndex(-1);
    }, [commandHistory]);

    const submitInput = () => {
        const cmd = command;
        setCommandHistory(prev => [...prev, cmd]);
        setCommand("");
        setManualEdit(false);
        sendInput(cmd);
    };

    const handleInputChange = (e) => {
        setCommand(e.target.value);
        setManualEdit(e.target.value !== "");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            setCommand("");
            setManualEdit(false);
            return;
        }
        else if (e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            submitInput();
            setManualEdit(false);
            return;
        }
        else if (e.ctrlKey && e.altKey && e.key === "ArrowDown") {
            e.preventDefault();
            scrollToBottom();
            return;
        }

        if (manualEdit)
            return;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                setHistoryIndex(prev => prev + 1);
                setCommand(commandHistory[commandHistory.length - historyIndex - 2]);
                setManualEdit(false);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > -1) {
                setHistoryIndex(prev => prev - 1);
                setCommand(historyIndex > 0 ? commandHistory[commandHistory.length - historyIndex] : "");
            }
        }
    };

    const handleWheel = (e) => {
        if (manualEdit)
            return;

        if (e.deltaY < 0) {
            if (historyIndex < commandHistory.length - 1) {
                setHistoryIndex(prev => prev + 1);
                setCommand(commandHistory[commandHistory.length - historyIndex - 2]);
                setManualEdit(false);
            }
        } else if (e.deltaY > 0) {
            if (historyIndex > -1) {
                setHistoryIndex(prev => prev - 1);
                setCommand(historyIndex > 0 ? commandHistory[commandHistory.length - historyIndex] : "");
            }
        }
    };

    return (
        <VStack>
            <Textarea
                autoFocus
                spellCheck={false}
                rows={6}
                placeholder={
                    `Type your console commands here and press |Shift|+|Enter| to send it to the game${String.fromCharCode(10)}` +
                    `${String.fromCharCode(10)}` +
                    `Use |UpArrow| and |DownArrow| keys or mouse |WheelUp| and |WheelDown| to scroll command history${String.fromCharCode(10)}` +
                    `Use |Ctrl|+|Alt|+|DownArrow| to scroll to the last output${String.fromCharCode(10)}` +
                    `Use |Escape| to clear current input`
                }
                value={command}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onWheel={handleWheel}
            />
            <IconButton
                className="button"
                icon={<Icon as={FiSend} />}
                onClick={submitInput}
                position="absolute"
                bottom="27px"
                right="27px"
                zIndex="1"
                isDisabled={!command}
            />
        </VStack>
    );
}
