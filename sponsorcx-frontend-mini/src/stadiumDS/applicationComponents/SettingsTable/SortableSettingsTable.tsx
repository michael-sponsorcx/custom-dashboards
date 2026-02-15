import { Divider, Flex, Table, Text } from '@mantine/core';
import colors from '@/stadiumDS/foundations/colors';
import * as S from './SettingsTable.styles';
import tableClasses from './SettingsTable.module.css';
import GenericListEmptyState from '../emptyStates/GenericListEmptyState';
import Search from '@/stadiumDS/foundations/icons/General/Search';
import { ReactNode, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import Menu05 from '@/stadiumDS/foundations/icons/General/Menu05';

export interface SortableSettingsTableColumn<T extends Record<string, any>> {
    label: ReactNode;
    key: string;
    render?: (data: T) => string | React.ReactNode;
    width?: string;
    maxWidth?: string;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

interface DefaultRowProps<T extends Record<string, any>> {
    data: T;
    columns: SortableSettingsTableColumn<T>[];
}

/**
 * this is only used for default fields and should be removed when default fields are orderable
 */
const DefaultRow = <T extends Record<string, any>>({
    data,
    columns,
}: DefaultRowProps<T>) => {
    return (
        <Table.Tr>
            <Table.Td></Table.Td>
            {columns.map((column) => (
                <Table.Td key={column.key}>
                    {column.render ? column.render(data) : data[column.key]}
                </Table.Td>
            ))}
        </Table.Tr>
    );
};

interface DraggableRowProps<T extends Record<string, any>> {
    data: T;
    index: number;
    columns: SortableSettingsTableColumn<T>[];
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    onDragEnd: () => void;
    onDragStart?: () => void;
}

const DraggableRow = <T extends Record<string, any>>({
    data,
    index,
    columns,
    onReorder,
    onDragEnd,
    onDragStart,
}: DraggableRowProps<T>) => {
    const rowRef = useRef<HTMLTableRowElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: 'settings-table-row',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!rowRef.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = rowRef.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Get mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            onReorder(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'settings-table-row',
        item: () => {
            onDragStart?.();
            return { id: data.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: () => {
            onDragEnd();
        },
    });

    // Connect drag to the handle, drop to the row
    drag(dragHandleRef);
    drop(rowRef);

    return (
        <Table.Tr
            ref={rowRef}
            key={`custom-field-table-row-${data.id}`}
            data-handler-id={handlerId}
            style={{
                opacity: isDragging ? 0.4 : 1,
            }}
        >
            <Table.Td
                style={{
                    width: '40px',
                    padding: '8px',
                }}
            >
                <div
                    ref={dragHandleRef}
                    draggable={false}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'grab',
                        userSelect: 'none',
                        pointerEvents: 'auto',
                    }}
                >
                    <Menu05 color={colors.Gray[400]} size="16" />
                </div>
            </Table.Td>
            {columns.map((column) => (
                <Table.Td
                    key={column.key}
                    style={{
                        width: column.width,
                        maxWidth: column.maxWidth,
                    }}
                >
                    {column.render ? column.render(data) : data[column.key]}
                </Table.Td>
            ))}
        </Table.Tr>
    );
};

type SortableSettingsTableProps<T extends Record<string, any>> = {
    header: {
        title: string;
        subTitle: string;
        extraContent?: React.ReactNode;
    };
    table?: {
        columns: SortableSettingsTableColumn<T>[];
        data: T[];
        loading?: boolean;
        onReorder: (dragIndex: number, hoverIndex: number) => void;
        onDragEnd: () => void;
        onDragStart?: () => void;
    };
    children?: React.ReactNode;
    emptyState?: {
        button?: React.ReactNode;
        title?: string;
        description?: string;
        forceShow?: boolean;
    };
} & (
    | {
          table: {
              columns: SortableSettingsTableColumn<T>[];
              data: T[];
              loading?: boolean;
              onReorder: (dragIndex: number, hoverIndex: number) => void;
              onDragEnd: () => void;
              onDragStart?: () => void;
          };
      }
    | {
          children: React.ReactNode;
      }
);

export const SortableSettingsTable = <T extends Record<string, any>>({
    header,
    table,
    children,
    emptyState,
}: SortableSettingsTableProps<T>) => {
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
                            <Table.Th style={{ width: '40px' }}></Table.Th>
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
                            {table.data
                                .filter(
                                    (data) => data.id && data.isDefault == true
                                )
                                .map((data) => (
                                    <DefaultRow
                                        key={`default-row-${data.id}`}
                                        data={data}
                                        columns={table.columns}
                                    />
                                ))}
                        </Table.Tbody>
                        <Table.Tbody>
                            {table.data
                                .filter(
                                    (data) => data.id && data.isDefault !== true
                                ) // Ensure all items have an id and are not default
                                .map((data) => {
                                    const actualIndex = table.data.findIndex(
                                        (item) => item.id === data.id
                                    );
                                    return (
                                        <DraggableRow
                                            key={`draggable-row-${data.id}`}
                                            data={data}
                                            index={actualIndex}
                                            columns={table.columns}
                                            onReorder={table.onReorder}
                                            onDragEnd={table.onDragEnd}
                                            onDragStart={table.onDragStart}
                                        />
                                    );
                                })}
                        </Table.Tbody>
                    </Table>
                    {(!table.loading && !table.data.length) ||
                    (!!emptyState && emptyState.forceShow)
                        ? EmptyStateComponent
                        : null}
                </S.TableWrapper>
            ) : (
                <>
                    <Divider />
                    {!!emptyState && emptyState.forceShow ? (
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
