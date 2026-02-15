import { useFileUploader } from '@/hooks/useFileUploader';
import { useUniversalUploadList } from '@/hooks/useUniversalUploadList';
import colors from '@/stadiumDS/foundations/colors';
import Paperclip from '@/stadiumDS/foundations/icons/General/Paperclip';
import {
    FileInput,
    Flex,
    Menu,
    Text,
    Tooltip,
    UnstyledButton,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { UploadContent } from '@/stadiumDS/applicationComponents/UploadContent/UploadContent';
import { UploadModal } from '@/stadiumDS/applicationComponents/UploadModal/UploadModal';
import { fileSizeHelper } from '@/stadiumDS/applicationComponents/UploadsPage/helpers/FileSizeHelper';
import { TaskUploadProps } from './TasksSection.type';

export const TaskUpload = ({
    taskId,
    setHoveringUploadIds,
    recordType,
    refetchQueries,
    originHelperFn,
    refetch: parentRefetch,
    uploadRefetchCount,
    canEdit = false,
    uploads,
    handleDelete: parentHandleDelete,
    handleUpload: parentHandleUpload,
}: TaskUploadProps & { taskId: string; canEdit?: boolean }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const {
        handleDelete: defaultHandleDelete,
        refetch,
        uploadsToDisplay: defaultUploadsToDisplay,
    } = useUniversalUploadList({
        recordType,
        recordId: uploads ? undefined : taskId,
        onDelete: () => {
            parentRefetch?.();
        },
        refetchQueries,
        viewPermission: undefined,
        editPermission: undefined,
    });

    const handleDelete = parentHandleDelete || defaultHandleDelete;

    const uploadsToDisplay = uploads || defaultUploadsToDisplay;

    const { handleUpload: defaultHandleUpload } = useFileUploader({
        recordType,
        recordId: taskId,
        onUploadComplete: () => {
            refetch();
            parentRefetch?.();
        },
    });

    const handleUpload = async (files: File[]) => {
        if (parentHandleUpload) {
            await parentHandleUpload(files, taskId);
        } else {
            await defaultHandleUpload(files);
        }
    };

    const fileInputRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (uploadRefetchCount) {
            refetch();
        }
    }, [uploadRefetchCount]);

    return (
        <>
            {uploadsToDisplay.length > 0 ? (
                <>
                    <Menu>
                        <Menu.Target>
                            <Tooltip
                                label={
                                    <Flex
                                        align="center"
                                        justify="center"
                                        gap="4px"
                                    >
                                        {uploadsToDisplay.map(
                                            (upload, index) => {
                                                if (index > 2) {
                                                    return null;
                                                }
                                                if (
                                                    index === 2 &&
                                                    uploadsToDisplay.length > 3
                                                ) {
                                                    return (
                                                        <Flex
                                                            key={`task-upload-${taskId}-${index}`}
                                                            justify="center"
                                                            align="center"
                                                            style={{
                                                                height: '25px',
                                                                width: '25px',
                                                                borderRadius:
                                                                    '6px',
                                                                backgroundColor:
                                                                    colors
                                                                        .Gray[200],
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize:
                                                                        '10px',
                                                                    fontWeight:
                                                                        '600',
                                                                    color: colors
                                                                        .Gray[700],
                                                                }}
                                                            >
                                                                +
                                                                {uploadsToDisplay.length -
                                                                    2}
                                                            </Text>
                                                        </Flex>
                                                    );
                                                }
                                                return (
                                                    <Flex
                                                        key={`task-upload-${taskId}-${index}`}
                                                        justify="center"
                                                        align="center"
                                                        style={{
                                                            height: '25px',
                                                            width: '25px',
                                                        }}
                                                    >
                                                        <UploadContent
                                                            upload={upload}
                                                            borderRadius="4px"
                                                            playIconSize="16"
                                                            documentScale={0.75}
                                                        />
                                                    </Flex>
                                                );
                                            }
                                        )}
                                    </Flex>
                                }
                            >
                                <UnstyledButton
                                    onMouseEnter={() =>
                                        setHoveringUploadIds?.(
                                            uploadsToDisplay.map((u) => u.id)
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setHoveringUploadIds?.([])
                                    }
                                    style={{
                                        minHeight: '16px',
                                        maxHeight: '16px',
                                    }}
                                >
                                    <Paperclip
                                        color={colors.Brand[400]}
                                        size="16"
                                    />
                                </UnstyledButton>
                            </Tooltip>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={() => setIsUploadModalOpen(true)}
                            >
                                View Uploads
                            </Menu.Item>
                            {canEdit && (
                                <Menu.Item
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Add Uploads
                                </Menu.Item>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                    <UploadModal
                        open={isUploadModalOpen}
                        onClose={() => setIsUploadModalOpen(false)}
                        uploads={uploadsToDisplay}
                        handleRemoveUpload={(upload) => {
                            handleDelete([upload.id]);
                        }}
                        originHelperFn={originHelperFn}
                        onUpdateUpload={() => {
                            refetch();
                            parentRefetch?.();
                        }}
                        disabled={!canEdit}
                    />
                </>
            ) : (
                <UnstyledButton
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        minHeight: '16px',
                        maxHeight: '16px',
                    }}
                    disabled={!canEdit}
                >
                    <Paperclip color={colors.Gray[400]} size="16" />
                </UnstyledButton>
            )}
            <FileInput
                ref={fileInputRef}
                onChange={async (files) => {
                    if (files && fileSizeHelper(files)) {
                        await handleUpload(files);
                    }
                }}
                style={{
                    display: 'none',
                }}
                multiple
            />
        </>
    );
};
