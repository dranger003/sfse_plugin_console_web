import { useRef, useState, useEffect } from "react";
import { ChakraProvider, Flex, extendTheme } from "@chakra-ui/react";
import { ConsoleInput } from "./components/ConsoleInput";
import { ConsoleOutput } from "./components/ConsoleOutput";
import { Banner } from "./components/Banner";
import "./App.css"

export function App() {
  const theme = extendTheme({
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
  });

  const scrollRef = useRef(null);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState([]);

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    const isAtBottom = scrollElement.scrollTop === (scrollElement.scrollHeight - scrollElement.offsetHeight);
    setShowScrollButton(!isAtBottom);
  };

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

  const scrollToBottom = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  };

  const sendInput = async (cmd) => {
    const res = await fetch("/console", { method: "POST", body: cmd });
    const msg = await res.text();
    setMessages(prev => [...prev, `> ${msg.replace(/\n/g, "<br />")}`]);
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" height="100vh" p={4} gap={4}>
        <Banner />
        <ConsoleOutput
          scrollRef={scrollRef}
          messages={messages}
          showScrollButton={showScrollButton}
          scrollToBottom={scrollToBottom}
        />
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
