import { useRef, useState, useEffect } from "react";
import { Badge, ChakraProvider, Flex, HStack, Spacer, extendTheme } from "@chakra-ui/react";
import { Banner } from "./components/Banner";
import { ConsoleOutput } from "./components/ConsoleOutput";
import { QuickCommands } from "./components/QuickCommands";
import { ModeBadge } from "./components/ModeBadge";
import { ConsoleInput } from "./components/ConsoleInput";
import "./App.css";

export function App() {
  const theme = extendTheme({
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
  });

  const scrollRef = useRef(null);
  const streamRef = useRef(null);

  const [readyState, setReadyState] = useState(EventSource.CLOSED);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState([]);
  const [quickCommands, setQuickCommands] = useState([]);
  const [quickCommand, setQuickCommand] = useState("");
  const [mode, setMode] = useState("command");

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    const isAtBottom = scrollElement.scrollTop === (scrollElement.scrollHeight - scrollElement.offsetHeight);
    setShowScrollButton(!isAtBottom);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestedMode = query.get("mode");
    if (requestedMode === "command" || requestedMode === "stream")
      setMode(requestedMode);

    fetch("/QuickCommands.json")
      .then(res => res.json())
      .then(data => setQuickCommands(data))
      .catch(() => window.alert("Unable to load quick commands!"));
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement)
        scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  useEffect(() => {
    if (streamRef.current)
      streamRef.current.close();

    if (mode !== "stream")
      return;

    streamRef.current = new EventSource(`${process.env.NODE_ENV === "development" ? "http://127.0.0.1:12345" : ""}/stream`);
    streamRef.current.onopen = () => { setReadyState(streamRef.current.readyState) };
    streamRef.current.onerror = () => { setReadyState(streamRef.current.readyState) };
    streamRef.current.onmessage = (event) => {
      setReadyState(streamRef.current.readyState)

      const decodedData = atob(event.data);
      setMessages(prev => {
        const lastItem = prev.pop() || "";
        const updatedLastItem = lastItem === "" ? decodedData : `${lastItem}${decodedData}`;
        return [...prev, updatedLastItem];
      });
    };
  }, [mode]);

  const scrollToBottom = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  const sendInput = (cmd) => {
    fetch(`${process.env.NODE_ENV === "development" ? "http://127.0.0.1:12345" : ""}/console?mode=${mode}`, { method: "POST", body: cmd })
      .then(res => res.text())
      .then(msg => {
        setQuickCommand("");
        if (mode === "command") {
          setMessages(prev => [...prev, `> ${msg}`]);
        }
      });
  };

  const sendQuickCommand = (target) => {
    const cmd = target.command;
    const confirm = target.confirm;
    if (confirm)
      if (!window.confirm(`Are you sure you want to execute the command "${cmd}"?`))
        return;

    sendInput(cmd);
  };

  const switchMode = () => {
    if (window.confirm("Switching mode will reload the page and clear all history, do you want to continue?")) {
      const newMode = mode === "command" ? "stream" : "command";
      window.location.href = `${window.location.origin}${window.location.pathname}?mode=${newMode}`;
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" height="100vh" p={4} gap={2}>
        <Banner />
        <ConsoleOutput
          scrollRef={scrollRef}
          messages={messages}
          showScrollButton={showScrollButton}
          scrollToBottom={scrollToBottom}
        />
        <HStack>
          <QuickCommands
            quickCommand={quickCommand}
            quickCommands={quickCommands}
            sendQuickCommand={sendQuickCommand}
          />
          <Spacer />
          <ModeBadge
            mode={mode}
            switchMode={switchMode}
          />
          {mode === "stream" && (
            <Badge colorScheme={
              readyState === EventSource.CONNECTING ? "yellow" :
                readyState === EventSource.OPEN ? "green" :
                  readyState === EventSource.CLOSED ? "red" : "gray"
            }>
              {readyState === EventSource.CONNECTING ? "Connecting" :
                readyState === EventSource.OPEN ? "Connected" :
                  readyState === EventSource.CLOSED ? "Closed" : "Unknown"}
            </Badge>
          )}
        </HStack>
        <ConsoleInput
          command={command}
          setCommand={setCommand}
          sendInput={sendInput}
          scrollToBottom={scrollToBottom}
        />
      </Flex>
    </ChakraProvider>
  );
}
