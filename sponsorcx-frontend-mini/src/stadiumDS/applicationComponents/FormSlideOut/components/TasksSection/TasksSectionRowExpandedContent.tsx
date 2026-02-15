import { Button, Group, Stack } from '@mantine/core';
import { TasksSectionRowProps } from './TasksSection.type';
import { Files } from '../Files/Files';
import { useEffect, useState } from 'react';
import { useUniversalUploadList } from '@/hooks/useUniversalUploadList';
import styled from 'styled-components';
import colors from '@/stadiumDS/foundations/colors';
import Download from '@/stadiumDS/foundations/icons/General/Download';
import { Folder, handleDownloadFilesAsZip } from '@/utils/helpers';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';

const FilesContainer = styled(Group)`
    flex: 1;
    padding: 8px 0;
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${colors.Gray[300]};
        border-radius: 3px;

        &:hover {
            background-color: ${colors.Gray[400]};
        }
    }
    &::-webkit-scrollbar-track {
        background-color: ${colors.Gray[200]};
        border-radius: 3px;
    }
`;

export const TasksSectionRowExpandedContent = (props: TasksSectionRowProps) => {
    const [downloading, setDownloading] = useState(false);

    const { refetch, uploadsToDisplay: defaultUploadsToDisplay } =
        useUniversalUploadList({
            recordType: props.uploadProps.recordType,
            recordId: props.task.uploads ? undefined : props.task.id,
            viewPermission: undefined,
            editPermission: undefined,
        });

    const uploadsToDisplay = props.task.uploads || defaultUploadsToDisplay;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const folder: Folder = {
                name: `${
                    props.task.title ?? `Task (${props.task.id})`
                } Uploads`,
                files: uploadsToDisplay.map((upload) => ({
                    name: upload.display_name || upload.original_filename,
                    url: upload.s3_key,
                })),
                folders: [],
            };

            await handleDownloadFilesAsZip({
                folder,
            });
        } catch (error) {
            stadiumToast.error('Failed to download files');
        } finally {
            setDownloading(false);
        }
    };

    const downloadDisabled = uploadsToDisplay.length === 0;

    useEffect(() => {
        if (props.uploadProps.uploadRefetchCount) {
            refetch();
        }
    }, [props.uploadProps.uploadRefetchCount]);

    const uploadPropsHandleUpload = props.uploadProps.handleUpload;
    const handleUpload = uploadPropsHandleUpload
        ? (files: File[]) => uploadPropsHandleUpload(files, props.task.id)
        : undefined;

    return (
        <Group
            align="flex-start"
            style={{ padding: '8px 16px', gap: '8px', width: '100%' }}
        >
            <FilesContainer wrap="nowrap">
                <Files
                    recordType={props.uploadProps.recordType}
                    recordId={props.task.id}
                    uploads={uploadsToDisplay}
                    originHelperFn={props.uploadProps.originHelperFn}
                    refetch={() => {
                        refetch();
                        props.uploadProps.refetch?.();
                    }}
                    wrap={false}
                    disabled={!props.canEdit}
                    handleUpload={handleUpload}
                    handleDelete={props.uploadProps.handleDelete}
                />
            </FilesContainer>
            {!downloadDisabled && (
                <Stack align="flex-end" style={{ gap: '0', padding: '8px 0' }}>
                    <Button
                        variant="transparent"
                        style={{
                            padding: '2px 4px',
                            width: 'fit-content',
                        }}
                        onClick={handleDownload}
                        disabled={downloading}
                    >
                        <Group style={{ gap: '4px' }}>
                            <Download
                                variant="1"
                                color={
                                    downloadDisabled
                                        ? colors.Gray[400]
                                        : colors.Brand[400]
                                }
                            />
                            Download
                        </Group>
                    </Button>
                </Stack>
            )}
        </Group>
    );
};
