import { SlideOut } from '@/stadiumDS/sharedComponents/SlideOut';
import { Checkbox, Stack } from '@mantine/core';
import { ColumnDef } from '@tanstack/react-table';

interface ColumnsSelectSlideOutProps<T> {
    isOpen: boolean;
    onClose: () => void;
    visibleColumns: string[];
    onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
    columns: ColumnDef<T>[];
}

export function ColumnsSelectSlideOut<T>({
    isOpen,
    onClose,
    visibleColumns,
    onColumnVisibilityChange,
    columns,
}: ColumnsSelectSlideOutProps<T>) {
    const columnsWithoutExclusions = columns.filter(
        (column) => !column.meta?.excludeFromColumnsSelect
    );
    return (
        <SlideOut
            isOpen={isOpen}
            onClose={onClose}
            headerTitle="Columns Select"
            headerSubTitle="Choose what you want to see on the table"
            width="352px"
        >
            <Stack gap={12}>
                {columnsWithoutExclusions.map((column) => (
                    <Checkbox
                        key={column.id}
                        checked={visibleColumns.includes(column.id as string)}
                        onChange={(event) =>
                            onColumnVisibilityChange(
                                column.id as string,
                                event.currentTarget.checked
                            )
                        }
                        label={(column.header as string) || column.id}
                    />
                ))}
            </Stack>
        </SlideOut>
    );
}
