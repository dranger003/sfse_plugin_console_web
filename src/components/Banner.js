import { HStack, Image, Spacer } from "@chakra-ui/react";
import logo from "../logo.svg";
import title from "../title.svg";

export function Banner() {
    return (
        <HStack alignItems="flex-start" spacing={0}>
            <Image src={title} width="auto" height="60px" filter="invert(1)" />
            <Spacer />
            <Image src={logo} width="auto" height="60px" filter="invert(1)" />
        </HStack>
    );
}
