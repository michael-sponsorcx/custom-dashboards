import { ScxTile } from '@/components/ScxTile';
import colors from '@/stadiumDS/foundations/colors';
import Clock from '@/stadiumDS/foundations/icons/Time/Clock';
import { formatDate } from '@/utils/helpers';
import { ActionIcon, Flex, Table, Text } from '@mantine/core';
import { useState } from 'react';
import tableClasses from './AssetFulfilledHistoryTable.module.css';
import { BrandAssetUsageUpdate } from '@/gql/brandAssetUsageUpdateGql';
import { StadiumConfirmActionPopup } from '@/stadiumDS/sharedComponents/ConfirmActionPopup/StadiumConfirmActionPopup';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';

interface AssetFulfilledHistoryProps {
    history: BrandAssetUsageUpdate[];
    handleDelete: (id: string) => void;
}

export const AssetFulfilledHistory = ({
    history,
    handleDelete,
}: AssetFulfilledHistoryProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <ScxTile
            expanded={expanded}
            expandedContent={
                <Flex
                    style={{
                        maxHeight: '164px',
                        overflow: 'auto',
                        scrollbarWidth: 'thin',
                    }}
                >
                    <Table withRowBorders={false} classNames={tableClasses}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ width: '64px' }}>
                                    QTY
                                </Table.Th>
                                <Table.Th style={{ width: '92px' }}>
                                    Date
                                </Table.Th>
                                <Table.Th>Note</Table.Th>
                                <Table.Th style={{ width: '54px' }} />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {history.map((item) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>
                                        {item.quantity_fulfilled}
                                    </Table.Td>
                                    <Table.Td>{formatDate(item.date)}</Table.Td>
                                    <Table.Td>{item.note}</Table.Td>
                                    <Table.Td>
                                        <StadiumConfirmActionPopup
                                            onConfirm={() => {
                                                handleDelete(item.id);
                                            }}
                                            getTrigger={(setOpen, open) => (
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
                                                >
                                                    <Trash
                                                        size="20"
                                                        variant="3"
                                                        color={colors.Gray[400]}
                                                    />
                                                </ActionIcon>
                                            )}
                                            title="Delete fulfillment item?"
                                            description="This action cannot be undone."
                                            confirmButtonText="Delete"
                                        />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Flex>
            }
            onTileClick={() => setExpanded(!expanded)}
            includeChevron
        >
            <Flex direction="row" gap="8px">
                <Clock variant="rewind" size="20" color={colors.Gray[600]} />
                <Text
                    style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: colors.Gray[700],
                    }}
                >
                    History
                </Text>
            </Flex>
        </ScxTile>
    );
};
