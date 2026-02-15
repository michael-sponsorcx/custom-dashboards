import colors from '@/stadiumDS/foundations/colors';
import { EditInPlaceInput } from '@/stadiumDS/sharedComponents/inputs/editInPlaceInput';
import { Flex, Text } from '@mantine/core';

interface InfoPopoverCellProps {
    title: string;
    description: string;
    onEdit?: (description: string) => void;
}

export const InfoPopoverCell = ({
    title,
    description,
    onEdit,
}: InfoPopoverCellProps) => {
    return (
        <Flex gap="4px" align="flex-end" justify="space-between">
            <Flex
                direction="column"
                gap="4px"
                style={{ flex: 1, overflow: 'hidden' }}
            >
                <Text c={colors.Gray[500]} fs="italic" truncate>
                    {title}
                </Text>
                {onEdit ? (
                    <EditInPlaceInput
                        value={description}
                        onChange={(value) => onEdit(value)}
                        showEditIcon
                    />
                ) : (
                    <Text truncate>{description}</Text>
                )}
            </Flex>
        </Flex>
    );
};
