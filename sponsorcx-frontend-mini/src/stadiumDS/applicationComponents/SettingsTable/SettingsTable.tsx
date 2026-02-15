import { Divider, Flex, Table, Text } from '@mantine/core';
import colors from '@/stadiumDS/foundations/colors';
import * as S from './SettingsTable.styles';
import tableClasses from './SettingsTable.module.css';
import GenericListEmptyState from '../emptyStates/GenericListEmptyState';
import Search from '@/stadiumDS/foundations/icons/General/Search';
import { ReactNode } from 'react';

export interface SettingsTableColumn<T extends Record<string, any>> {
    label: ReactNode;
    key: string;
    render?: (data: T) => string | React.ReactNode;
    width?: string;
    maxWidth?: string;
}

type SettingsTableProps<T extends Record<string, any>> = {
    header: {
        title: string;
        subTitle: string;
        extraContent?: React.ReactNode;
    };
    table?: {
        columns: SettingsTableColumn<T>[];
        data: T[];
        loading?: boolean;
    };
    children?: React.ReactNode;
    emptyState?: {
        button?: React.ReactNode;
        title?: string;
        description?: string;
        show?: boolean;
    };
} & (
    | {
          table: {
              columns: SettingsTableColumn<T>[];
              data: T[];
              loading?: boolean;
          };
      }
    | {
          children: React.ReactNode;
      }
);

export const SettingsTable = <T extends Record<string, any>>({
    header,
    table,
    children,
    emptyState,
}: SettingsTableProps<T>) => {
    const EmptyStateComponent = (
        <Flex justify="center" align="center" w="100%">
            <GenericListEmptyState
                icon={
                    <Search variant="sm" size="20" color={colors.Gray[400]} />
                }
                marginTop="100px"
                includeOuterRings
                title={emptyState?.title || 'No Data'}
                description={emptyState?.description || 'No data found'}
                button={emptyState?.button}
            />
        </Flex>
    );

    return (
        <S.TableContainer>
            <S.TableHeader>
                <S.TitleContainer>
                    <Text
                        fz="var(--mantine-font-size-xl)"
                        fw={600}
                        c={colors.Gray[900]}
                        data-testid="settings-table-header-title"
                    >
                        {header.title}
                    </Text>
                    <Text c={colors.Gray[600]}>{header.subTitle}</Text>
                </S.TitleContainer>
                <S.HeaderExtraContent>
                    {header.extraContent}
                </S.HeaderExtraContent>
            </S.TableHeader>
            {table ? (
                <S.TableWrapper>
                    <Table classNames={tableClasses} style={{ zIndex: 1 }}>
                        <Table.Thead>
                            {table.columns.map((column) => (
                                <Table.Th
                                    key={column.key}
                                    style={{
                                        width: column.width,
                                        maxWidth: column.maxWidth,
                                    }}
                                >
                                    {column.label}
                                </Table.Th>
                            ))}
                        </Table.Thead>
                        <Table.Tbody>
                            {table.data.map((data) => (
                                <Table.Tr
                                    key={`custom-field-table-row-${data.id}`}
                                >
                                    {table.columns.map((column) => (
                                        <Table.Td
                                            key={column.key}
                                            style={{
                                                width: column.width,
                                                maxWidth: column.maxWidth,
                                            }}
                                        >
                                            {column.render
                                                ? column.render(data)
                                                : data[column.key]}
                                        </Table.Td>
                                    ))}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    {(!table.loading && !table.data.length) || emptyState?.show
                        ? EmptyStateComponent
                        : null}
                </S.TableWrapper>
            ) : (
                <>
                    <Divider />
                    {emptyState?.show ? (
                        EmptyStateComponent
                    ) : (
                        <Flex
                            direction="column"
                            gap="16px"
                            style={{
                                padding: '16px',
                                overflowY: 'scroll',
                                scrollbarWidth: 'thin',
                            }}
                        >
                            {children}
                        </Flex>
                    )}
                </>
            )}
        </S.TableContainer>
    );
};
