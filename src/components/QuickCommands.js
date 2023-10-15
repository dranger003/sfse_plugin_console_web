import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

export function QuickCommands({ quickCommands, sendQuickCommand }) {
    const handleChange = (command, confirm) => {
        sendQuickCommand({ command, confirm: confirm ?? false });
    };

    return (
        <Menu>
            <MenuButton
                className="button"
                as={Button}
                size="sm"
                w="xs"
                rightIcon={<FiChevronDown />}
                textAlign="left"
                textTransform="uppercase"
            >
                Quick Commands
            </MenuButton>
            <MenuList className="menulist">
                {quickCommands.map((qc, i) => (
                    <MenuItem key={i} onClick={() => handleChange(qc.command, qc.confirm)} command={qc.confirm ? "Confirm" : ""}>
                        {qc.label}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
