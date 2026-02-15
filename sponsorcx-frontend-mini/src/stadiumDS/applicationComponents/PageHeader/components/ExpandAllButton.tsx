import Expand from '@/stadiumDS/foundations/icons/Arrows/Expand';
import Minimize from '@/stadiumDS/foundations/icons/Layout/Minimize';
import { ActionIcon, Tooltip } from '@mantine/core';

interface ExpandAllButtonProps {
    isAllExpanded: boolean;
    setIsAllExpanded: (isAllExpanded: boolean) => void;
    expandingDisabled?: boolean;
}

const ExpandAllButton = ({
    isAllExpanded,
    setIsAllExpanded,
    expandingDisabled,
}: ExpandAllButtonProps): JSX.Element => {
    return (
        <Tooltip label={isAllExpanded ? 'Collapse All' : 'Expand All'}>
            <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => {
                    if (expandingDisabled) return;
                    setIsAllExpanded(!isAllExpanded);
                }}
                disabled={expandingDisabled}
            >
                {isAllExpanded ? (
                    <Minimize variant="2" />
                ) : (
                    <Expand variant="5" />
                )}
            </ActionIcon>
        </Tooltip>
    );
};

export default ExpandAllButton;
