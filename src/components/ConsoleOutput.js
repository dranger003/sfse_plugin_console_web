import { Box, Flex, HStack, Icon, IconButton, VStack } from "@chakra-ui/react";
import { FiArrowDown } from "react-icons/fi";

export function ConsoleOutput({ scrollRef, messages, showScrollButton, scrollToBottom }) {
    return (
        <>
            <Flex flex="1" position="relative" direction="column" className="scrollable">
                <Box flex="1" overflow="auto" ref={scrollRef}>
                    <VStack spacing={2} width="100%" maxHeight="0">
                        {messages.map((m, i) => (
                            <HStack width="100%">
                                <Box className="message" key={i} dangerouslySetInnerHTML={{ __html: m }} whiteSpace="nowrap" overflowY="auto"></Box>
                            </HStack>
                        ))}
                    </VStack>
                </Box>
                {showScrollButton && (
                    <IconButton
                        icon={<Icon as={FiArrowDown} />}
                        onClick={scrollToBottom}
                        position="absolute"
                        bottom={3}
                        right={8}
                    />
                )}
            </Flex>
        </>
    );
}
