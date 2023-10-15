import { useState } from "react";
import { Box, Flex, HStack, Icon, IconButton, VStack } from "@chakra-ui/react";
import { FiArrowDown, FiCopy, FiCheck } from "react-icons/fi";

export function ConsoleOutput({ scrollRef, messages, showScrollButton, scrollToBottom }) {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (m, i) => {
        navigator.clipboard.writeText(m)
            .then(() => {
                setCopiedIndex(i);
                setTimeout(() => setCopiedIndex(null), 1000);
            }, () => { });
    };

    return (
        <>
            <Flex flex="1" position="relative" direction="column" className="scrollable">
                <Box flex="1" overflow="auto" ref={scrollRef}>
                    <VStack spacing={2} width="100%" maxHeight="0">
                        {messages.map((m, i) => (
                            <HStack width="100%" key={i} position="relative">
                                <Box className="message" key={i} whiteSpace="pre-wrap" overflowY="auto">
                                    {m.split("\n").map((l, j, a) => (
                                        (j === a.length - 1 && l === "")
                                            ? null
                                            : l === ""
                                                ? <Box key={j} whiteSpace="nowrap">&nbsp;</Box>
                                                : <Box key={j} whiteSpace="nowrap">{l}</Box>
                                    ))}
                                </Box>
                                <IconButton
                                    className="button"
                                    icon={<Icon as={copiedIndex === i ? FiCheck : FiCopy} />}
                                    position="absolute"
                                    bottom="10px"
                                    right="10px"
                                    onClick={() => handleCopy(m, i)}
                                />
                            </HStack>
                        ))}
                    </VStack>
                </Box>
                {showScrollButton && (
                    <IconButton
                        className="button"
                        icon={<Icon as={FiArrowDown} />}
                        onClick={scrollToBottom}
                        position="absolute"
                        bottom={3}
                        right={6}
                    />
                )}
            </Flex>
        </>
    );
}
