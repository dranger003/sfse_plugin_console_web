import { Badge, Divider, Link, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";

export function ModeBadge({ mode, switchMode }) {
    return (
        <Link onClick={switchMode}>
            <Popover trigger="hover" placement="left">
                <PopoverTrigger>
                    <Badge>{mode}</Badge>
                </PopoverTrigger>
                <PopoverContent className="popover">
                    <PopoverBody>
                        <Text>
                            You are currently using the <Badge>{mode}</Badge> mode.
                            Click here to reload the page in <Badge>{mode === "command" ? "stream" : "command"}</Badge> mode.
                        </Text>
                        <Divider orientation="horizontal" my={2} />
                        <Text>
                            See below for a description of both modes.
                            Also note that switching mode reloads the app and clears the current output history.
                            You will be asked to confirm before the app switches mode.
                        </Text>
                        <Divider orientation="horizontal" my={2} />
                        <Text fontStyle="italic">
                            <Badge fontStyle="normal">Command</Badge> mode wraps each output within its own box. Each command execution output has an end.
                        </Text>
                        <Divider orientation="horizontal" my={2} />
                        <Text fontStyle="italic">
                            <Badge fontStyle="normal">Stream</Badge> mode is a continuous output flow. Each command execution is part of the same output with no end.
                        </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Link>

    );
}
