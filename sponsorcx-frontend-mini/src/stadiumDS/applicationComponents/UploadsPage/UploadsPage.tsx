import useDataTableConfig from '@/components/DataTable/hooks/useDataTableConfig';
import { useInfiniteScrollQuery } from '@/hooks/useInfiniteScrollQuery';
import { UploadNode } from '@/hooks/useUniversalUploadList';
import {
    UploadsFilterKeys,
    useUploadsFilters,
} from './hooks/useUploadsFilters';
import {
    getUploadsColumns,
    getDefaultUploadsHeaders,
} from './columns/Uploads.columns';
import useSavedViewSelect from '@/components/DataTable/hooks/useSavedViewSelect';
import { PageWrapper } from '@/stadiumDS/applicationComponents/PageWrapper/PageWrapper';
import PageHeader from '@/stadiumDS/applicationComponents/PageHeader/PageHeader';
import { DataTable } from '@/components/DataTable/DataTable';
import { DocumentNode } from 'graphql';
import { Button, ComboboxItem } from '@mantine/core';
import { AccessorKeyColumnDef } from '@tanstack/react-table';
import { TableHeaderAndKey } from '@/components/DataTable/DataTable.types';
import {
    DateRangeFilterValueType,
    PageHeaderFilter,
} from '../PageHeader/PageHeaderFilters/PageHeaderFilters.type';
import { FileInput } from '@mantine/core';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useFileUploader } from '@/hooks/useFileUploader';
import { Folder, handleDownloadFilesAsZip } from '@/utils/helpers';
import Pencil from '@/stadiumDS/foundations/icons/Editor/Pencil';
import colors from '@/stadiumDS/foundations/colors';
import { fileSizeHelper } from './helpers/FileSizeHelper';
import Rows from '@/stadiumDS/foundations/icons/Layout/Rows';
import List from '@/stadiumDS/foundations/icons/Layout/List';
import * as S from './UploadsPage.styles';
import { UploadCard } from './UploadCard';
import { InfiniteScrollFooter } from '../InfiniteScroll/InfiniteScrollFooter';
import { UploadModal } from '../UploadModal/UploadModal';
import { useMutation } from '@apollo/client';
import {
    deleteUploadsMutation,
    updateUploadMetadataMutation,
} from '@/gql/uploadGql';
import useStore from '@/state';
import { NoUploadsEmptyState } from '../emptyStates/NoUploadsEmptyState';
import useResetRowSelection from '@/hooks/useResetRowSelection/useResetRowSelection';
import { useUploadsBulkUpdateFields } from './hooks/useUploadsBulkUpdateFields';
import { SelectedValues } from '@/components/DataTable/BulkEditModal/BulkEditModal.types';
import BulkEditModal from '@/components/DataTable/BulkEditModal/BulkEditModal';
import { refetchAgreementHistoryQueries } from '@/hooks/useAgreementHistory';

/*
 * dataProps.query must have the following structure:
 *
 * query(...variables, $pagination: Pagination, $date_modified_min: String, $date_modified_max: String, $uploaded_by: [ID], $origin: [String], $file_type: [String]) {
 *     ...
 *     results {
 *         ...UploadNode
 *     }
 *     total
 * }
 *
 * Note: While pagination is optional, the response should follow the same format regardless of whether pagination is provided
 */

interface UploadsPageProps {
    uploadProps?: {
        recordType: string;
        recordId: string;
    };
    dataProps: {
        query: DocumentNode;
        queryName: string;
        variables: Record<string, any>;
        skip: boolean;
    };
    tableProps: {
        tableName: string;
        entityId?: string;
        entityIdLoading?: boolean;
        originHelperFn: (recordType: string) => string;
        additionalColumnHeaders?: (TableHeaderAndKey & {
            position: number;
        })[];
        additionalColumnAccessors?: Record<
            string,
            AccessorKeyColumnDef<UploadNode, string>
        >;
        additionalModalInfo?: {
            title: string;
            getDescription: (upload: UploadNode) => string;
            position: number;
        }[];
    };
    filterProps: {
        originOptions: ComboboxItem[];
        extraFilters?: {
            filter: PageHeaderFilter;
            position: number;
        }[];
    };
    downloadProps: {
        createFolderStructureHelperFn: (uploadNodes: UploadNode[]) => Folder;
    };
}

export const UploadsPage = ({
    filterProps,
    uploadProps,
    dataProps,
    tableProps,
    downloadProps,
}: UploadsPageProps) => {
    const organizationId = useStore((state) => state.organization?.id);

    const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(
        null
    );
    const [isCardView, setIsCardView] = useState(true);
    const [tableHeight, setTableHeight] = useState('650px');
    const [tableContainerRef, setTableContainerRef] =
        useState<HTMLDivElement | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [filteredUploads, setFilteredUploads] = useState<UploadNode[] | null>(
        null
    );

    const DEFAULT_TO_UPLOADS_CARD_VIEW = `default_to_uploads_card_view-${tableProps.tableName}`;

    useEffect(() => {
        const defaultToCardView = localStorage.getItem(
            DEFAULT_TO_UPLOADS_CARD_VIEW
        );
        if (defaultToCardView === 'false') {
            setIsCardView(false);
        } else {
            setIsCardView(true);
        }
    }, [DEFAULT_TO_UPLOADS_CARD_VIEW]);

    useEffect(() => {
        if (tableContainerRef) {
            const offset = tableContainerRef.offsetTop;
            setTableHeight(`calc(100vh - ${offset + 16}px)`);
        }
    }, [tableContainerRef?.offsetTop]);

    const {
        defaultFilters,
        appliedFilterValues,
        updateFilters,
        handleResetFilters,
        filtersAreApplied,
        filterResetValues,
        setQueryParams,
    } = useUploadsFilters({
        originOptions: filterProps.originOptions,
        extraFilters: filterProps.extraFilters,
        tableName: tableProps.tableName,
    });

    const {
        tableColumnHeaders,
        columnSorting,
        setColumnSorting,
        columnPinning,
        setColumnPinning,
        columnOrder,
        setColumnOrder,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        isSelectColumnsSlideoutOpen,
        setIsSelectColumnsSlideoutOpen,
        columnWidths,
        setColumnWidths,
        activeView,
        savedViews,
        refetchSavedViews,
        savedViewsLoading,
        setActiveViewId,
    } = useDataTableConfig({
        initialTableColumnHeaders: getDefaultUploadsHeaders({
            additionalColumnHeaders: tableProps.additionalColumnHeaders,
        }),
        tableName: tableProps.tableName,
        entityId: tableProps.entityId,
        entityIdLoading: tableProps.entityIdLoading,
        setQueryParams,
    });

    const { handleViewSelect } = useSavedViewSelect({
        updateFilters,
        filterResetValues,
    });

    const { data, addPage, refetch, hasMoreData, loading } =
        useInfiniteScrollQuery<UploadNode>({
            query: dataProps.query,
            queryName: dataProps.queryName,
            variables: {
                ...dataProps.variables,
                ...appliedFilterValues,
                ...(appliedFilterValues[UploadsFilterKeys.DATE_MODIFIED_RANGE]
                    ? {
                          date_modified_min: (
                              appliedFilterValues[
                                  UploadsFilterKeys.DATE_MODIFIED_RANGE
                              ] as DateRangeFilterValueType
                          )[0],
                          date_modified_max: (
                              appliedFilterValues[
                                  UploadsFilterKeys.DATE_MODIFIED_RANGE
                              ] as DateRangeFilterValueType
                          )[1],
                      }
                    : {}),
            },
            skip: dataProps.skip,
            pageSize: 100,
            activeViewId: activeView?.id,
        });

    const [updateUpload] = useMutation(updateUploadMetadataMutation, {
        onCompleted: () => {
            refetch();
        },
    });

    const handleUpdateUpload = async (
        id: string,
        updateFields: { display_name?: string; notes?: string }
    ) => {
        await updateUpload({
            variables: {
                id,
                organization_id: organizationId,
                ...updateFields,
            },
        });
    };

    const uploadsColumns = getUploadsColumns({
        tableColumnHeaders,
        refetchUploads: refetch,
        originHelperFn: tableProps.originHelperFn,
        additionalColumnAccessors: tableProps.additionalColumnAccessors,
        handleUpdateUpload,
    });

    const { handleUpload } = useFileUploader({
        recordType: uploadProps?.recordType ?? '',
        recordId: uploadProps?.recordId ?? '',
        onUploadComplete: refetch,
    });

    const fileInputRef = useRef<HTMLButtonElement>(null);

    const handleDownload = async (data: UploadNode[]) => {
        setDownloading(true);
        const folder = downloadProps.createFolderStructureHelperFn(data);

        await handleDownloadFilesAsZip({
            folder,
        });
        setDownloading(false);
    };

    const [deleteUploads] = useMutation(deleteUploadsMutation, {
        onCompleted: () => {
            refetch();
        },
        refetchQueries: refetchAgreementHistoryQueries,
    });

    const handleDelete = async (ids: string[]) => {
        await deleteUploads({
            variables: {
                ids,
                organization_id: organizationId,
            },
        });
    };

    useEffect(() => {
        if (
            activeUploadIndex !== null &&
            activeUploadIndex >= data.length - 3 &&
            !loading &&
            hasMoreData
        ) {
            addPage();
        }
    }, [loading, hasMoreData, data, activeUploadIndex]);

    const resetRowSelection = useResetRowSelection(
        appliedFilterValues,
        setRowSelection
    );

    const { bulkUpdateFields: uploadsBulkEditFields, bulkUpdateGql } =
        useUploadsBulkUpdateFields({
            onBulkUpdateComplete: resetRowSelection,
            queryName: dataProps.queryName,
        });
    const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false);

    const handleUploadsBulkUpdate = (fieldsToUpdate: SelectedValues) => {
        const nonNullFieldsToUpdate = Object.fromEntries(
            Object.entries(fieldsToUpdate).filter(
                ([_, value]) => value !== undefined && value !== null
            )
        );

        bulkUpdateGql({
            variables: {
                organization_id: organizationId,
                uploadIds: Object.keys(rowSelection),
                fieldsToUpdate: nonNullFieldsToUpdate,
            },
        });
    };

    const getDataContent = () => {
        if (data.length === 0 && !loading) {
            return (
                <S.CardViewContainer
                    ref={setTableContainerRef}
                    $height={tableHeight}
                >
                    <NoUploadsEmptyState
                        handlePrimaryBtnClick={() => {
                            fileInputRef.current?.click();
                        }}
                        hidePrimaryBtn={!uploadProps?.recordType}
                    />
                </S.CardViewContainer>
            );
        }
        if (isCardView) {
            return (
                <S.CardViewContainer
                    ref={setTableContainerRef}
                    $height={tableHeight}
                >
                    <S.CardsContainer>
                        {data.map((upload, index) => (
                            <UploadCard
                                key={`upload-card-${upload.id}`}
                                upload={upload}
                                handleCardClick={() =>
                                    setActiveUploadIndex(index)
                                }
                                selected={activeUploadIndex === index}
                            />
                        ))}
                    </S.CardsContainer>
                    <InfiniteScrollFooter
                        loading={loading}
                        hasMore={hasMoreData}
                        addPage={addPage}
                    />
                </S.CardViewContainer>
            );
        }
        return (
            <DataTable
                data={data}
                columns={uploadsColumns}
                tableOptions={{
                    state: {
                        sorting: columnSorting,
                        columnOrder,
                        columnPinning,
                        columnVisibility,
                        columnWidths,
                        expanded: true, //* Set expanded state to show all rows
                        rowSelection,
                    },
                    onSortingChange: setColumnSorting,
                    onColumnOrderChange: setColumnOrder,
                    onColumnPinningChange: setColumnPinning,
                    onColumnVisibilityChange: setColumnVisibility,
                    onColumnWidthsChange: setColumnWidths,
                    onRowSelectionChange: setRowSelection,
                    enableColumnPinning: true,
                    enableGrouping: true,
                    enableExpanding: false, //* Disable manual expansion/collapse
                    enableRowSelection: true,
                }}
                onLoadMore={addPage}
                hasNextPage={hasMoreData}
                isLoading={loading}
                selectedItemId={
                    activeUploadIndex !== null
                        ? data[activeUploadIndex].id
                        : undefined
                }
                onRowClick={(row) =>
                    setActiveUploadIndex(
                        data.findIndex((upload) => upload.id === row.id)
                    )
                }
                handleBulkEditClicked={() => setBulkEditModalOpen(true)}
            />
        );
    };

    return (
        <PageWrapper>
            <FileInput
                ref={fileInputRef}
                multiple
                onChange={(files) => {
                    if (fileSizeHelper(files)) {
                        handleUpload(files);
                    }
                }}
                style={{ display: 'none' }}
            />
            <PageHeader
                tableName={tableProps.tableName}
                primaryBtnText="Upload"
                handlePrimaryBtnClick={() => {
                    fileInputRef.current?.click();
                }}
                hidePrimaryBtn={!uploadProps?.recordType}
                appliedFilterValues={appliedFilterValues}
                handleResetFilters={handleResetFilters}
                updateFilters={updateFilters}
                filtersAreApplied={filtersAreApplied}
                currentColumnOrder={columnOrder}
                currentSorting={columnSorting}
                currentColumnPinning={columnPinning}
                currentColumnWidths={columnWidths}
                onViewSelect={handleViewSelect}
                defaultFilters={defaultFilters}
                currentColumnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                isSelectColumnsSlideoutOpen={isSelectColumnsSlideoutOpen}
                setIsSelectColumnsSlideoutOpen={setIsSelectColumnsSlideoutOpen}
                tableColumns={uploadsColumns}
                threeDotMenuOptions={[
                    {
                        key: 'columns-select',
                        label: 'Columns Select',
                        onClick: () => setIsSelectColumnsSlideoutOpen(true),
                        icon: (
                            <Pencil
                                variant="1"
                                color={colors.Gray[600]}
                                size="16"
                            />
                        ),
                    },
                ]}
                viewToggleItems={[
                    {
                        key: 'card',
                        tooltip: 'Card View',
                        children: (
                            <Rows
                                variant="1"
                                color={colors.Gray[700]}
                                size="18"
                            />
                        ),
                        isActive: isCardView,
                        onClick: () => {
                            setIsCardView(true);
                            localStorage.setItem(
                                DEFAULT_TO_UPLOADS_CARD_VIEW,
                                'true'
                            );
                        },
                    },
                    {
                        key: 'list',
                        tooltip: 'List View',
                        children: <List color={colors.Gray[700]} size="18" />,
                        isActive: !isCardView,
                        onClick: () => {
                            setIsCardView(false);
                            localStorage.setItem(
                                DEFAULT_TO_UPLOADS_CARD_VIEW,
                                'false'
                            );
                        },
                    },
                ]}
                entityId={tableProps.entityId}
                entityIdLoading={tableProps.entityIdLoading}
                activeView={activeView}
                savedViews={savedViews}
                refetchSavedViews={refetchSavedViews}
                savedViewsLoading={savedViewsLoading}
                setActiveViewId={setActiveViewId}
            />
            {getDataContent()}
            <UploadModal
                open={activeUploadIndex !== null}
                onClose={() => {
                    setActiveUploadIndex(null);
                }}
                uploads={filteredUploads ?? data}
                handleRemoveUpload={(upload) => handleDelete([upload.id])}
                initialIndex={activeUploadIndex ?? 0}
                onCurrentIndexChange={
                    filteredUploads ? undefined : setActiveUploadIndex
                }
                originHelperFn={tableProps.originHelperFn}
                additionalModalInfo={tableProps.additionalModalInfo}
            />
            <BulkEditModal
                open={bulkEditModalOpen}
                onClose={() => setBulkEditModalOpen(false)}
                fields={uploadsBulkEditFields}
                onBulkEditConfirm={handleUploadsBulkUpdate}
                onBulkDelete={async () => {
                    await handleDelete(Object.keys(rowSelection));
                    resetRowSelection();
                }}
                entityType="uploads"
                additionalContent={
                    <Fragment>
                        <Button
                            onClick={async () => {
                                const dataToDownload = data.filter(
                                    (upload) => rowSelection[upload.id]
                                );
                                await handleDownload(dataToDownload);
                            }}
                            loading={downloading}
                        >
                            Download
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilteredUploads(
                                    data.filter(
                                        (upload) => rowSelection[upload.id]
                                    )
                                );
                                setBulkEditModalOpen(false);
                                setActiveUploadIndex(0);
                            }}
                        >
                            View
                        </Button>
                    </Fragment>
                }
            />
        </PageWrapper>
    );
};
