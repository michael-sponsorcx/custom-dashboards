import { TableHeaderAndKey } from '@/components/DataTable/DataTable.types';
import { UploadNode } from '@/hooks/useUniversalUploadList';
import {
    AccessorKeyColumnDef,
    ColumnDef,
    createColumnHelper,
} from '@tanstack/react-table';
import { UploadsNameCell } from './cells/UploadsNameCell';
import { UploadsUploadedByCell } from './cells/UploadsUploadedByCell';
import { UploadsOriginCell } from './cells/UploadsOriginCell';
import { UploadsFileTypeCell } from './cells/UploadsFileTypeCell';
import { UploadsUpdatedAtCell } from './cells/UploadsUpdatedAtCell';
import { UploadsNotesCell } from './cells/UploadsNotesCell';
import { UploadsActionsCell } from './cells/UploadsActionsCell';

const columnHelper = createColumnHelper<UploadNode>();

export const getDefaultUploadsHeaders = ({
    additionalColumnHeaders,
}: {
    additionalColumnHeaders?: (TableHeaderAndKey & {
        position: number;
    })[];
}): TableHeaderAndKey[] => {
    const columns = [
        { key: 'upload', header: 'Upload / Name' },
        { key: 'uploaded_by', header: 'Uploaded By' },
        { key: 'origin', header: 'Origin' },
        { key: 'file_type', header: 'File Type' },
        { key: 'updated_at', header: 'Date Modified' },
        { key: 'notes', header: 'Notes' },
        { key: 'actions', header: 'Actions' },
    ];

    if (additionalColumnHeaders) {
        additionalColumnHeaders.forEach(({ key, header, position }) => {
            columns.splice(position, 0, {
                key,
                header,
            });
        });
    }

    return columns;
};

interface GetUploadsColumnsArgs {
    tableColumnHeaders: TableHeaderAndKey[];
    refetchUploads: () => void;
    originHelperFn: (recordType: string) => string;
    additionalColumnAccessors?: Record<
        string,
        AccessorKeyColumnDef<UploadNode, string>
    >;
    handleUpdateUpload: (
        id: string,
        updateFields: { display_name?: string; notes?: string }
    ) => Promise<void>;
}

export const getUploadsColumns = ({
    tableColumnHeaders,
    refetchUploads,
    originHelperFn,
    additionalColumnAccessors,
    handleUpdateUpload,
}: GetUploadsColumnsArgs): ColumnDef<UploadNode, any>[] =>
    tableColumnHeaders.map(({ key, header }) => {
        switch (key) {
            case 'upload': {
                return columnHelper.accessor('presigned_url', {
                    id: key,
                    header,
                    cell: (info) => {
                        return <UploadsNameCell info={info} />;
                    },
                    size: 376,
                });
            }
            case 'uploaded_by': {
                return columnHelper.accessor('uploaded_by_user.id', {
                    id: key,
                    header,
                    cell: (info) => {
                        return <UploadsUploadedByCell info={info} />;
                    },
                });
            }
            case 'origin': {
                return columnHelper.accessor(
                    (row) => {
                        return row.uploadable_records?.[0]?.record_type;
                    },
                    {
                        id: key,
                        header,
                        cell: (info) => {
                            return (
                                <UploadsOriginCell
                                    info={info}
                                    originHelperFn={originHelperFn}
                                />
                            );
                        },
                    }
                );
            }
            case 'file_type': {
                return columnHelper.accessor(
                    (row) => {
                        return row.original_filename?.split('.').pop() ?? '';
                    },
                    {
                        id: key,
                        header,
                        cell: (info) => {
                            return <UploadsFileTypeCell info={info} />;
                        },
                    }
                );
            }
            case 'updated_at': {
                return columnHelper.accessor('updated_at', {
                    id: key,
                    header,
                    cell: (info) => {
                        return <UploadsUpdatedAtCell info={info} />;
                    },
                });
            }
            case 'notes': {
                return columnHelper.accessor('notes', {
                    id: key,
                    header,
                    cell: (info) => {
                        return (
                            <UploadsNotesCell
                                info={info}
                                handleUpdateUpload={handleUpdateUpload}
                            />
                        );
                    },
                    enableSorting: false,
                    size: 264,
                    meta: { stopRowClickInnerOnly: true },
                });
            }
            case 'actions':
                return columnHelper.accessor('id', {
                    id: key,
                    header,
                    cell: (info) => (
                        <UploadsActionsCell
                            info={info}
                            refetchUploads={refetchUploads}
                        />
                    ),
                    size: 50,
                    enableResizing: false,
                    meta: { stopRowClickInnerOnly: true, hideHeader: true },
                    enableSorting: false,
                });
            default: {
                return (
                    additionalColumnAccessors?.[key] ||
                    columnHelper.accessor(key as keyof UploadNode, {
                        id: key,
                        header,
                        cell: (info) => {
                            const infoString = info.getValue();
                            if (!infoString) {
                                return '--';
                            }
                            return infoString;
                        },
                    })
                );
            }
        }
    });
