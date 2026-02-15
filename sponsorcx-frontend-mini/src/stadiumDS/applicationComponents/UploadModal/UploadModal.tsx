import { UploadNode } from '@/hooks/useUniversalUploadList';
import colors from '@/stadiumDS/foundations/colors';
import Download from '@/stadiumDS/foundations/icons/General/Download';
import {
    formatDate,
    getNameFromObj,
    handleFileDownloadFromUrl,
} from '@/utils/helpers';
import { ActionIcon, Button, Flex, Grid, Modal, Textarea } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import classes from './UploadModal.module.css';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import { StadiumConfirmActionPopup } from '@/stadiumDS/sharedComponents/ConfirmActionPopup/StadiumConfirmActionPopup';
import { UploadContent } from '../UploadContent/UploadContent';
import InfoCircle from '@/stadiumDS/foundations/icons/General/InfoCircle';
import { InfoPopoverCell } from './components/InfoPopoverCell';
import { updateUploadMetadataMutation } from '@/gql/uploadGql';
import { useMutation } from '@apollo/client';
import useStore from '@/state';
import { stadiumToast } from '../Toasts/StadiumToast.helpers';

interface UploadModalProps {
    open: boolean;
    onClose: () => void;
    uploads: UploadNode[];
    handleRemoveUpload: (upload: UploadNode) => void;
    onUpdateUpload?: () => void;
    initialIndex?: number | null;
    onCurrentIndexChange?: (index: number) => void;
    disabled?: boolean;
    originHelperFn: (recordType: string) => string;
    additionalModalInfo?: {
        title: string;
        getDescription: (upload: UploadNode) => string;
        position: number;
    }[];
    disabledByType?: (recordType: string) => boolean;
}

export const UploadModal = ({
    open,
    onClose,
    uploads,
    handleRemoveUpload,
    onUpdateUpload,
    initialIndex,
    onCurrentIndexChange,
    disabled,
    originHelperFn,
    additionalModalInfo,
    disabledByType,
}: UploadModalProps) => {
    const organizationId = useStore((state) => state.organization.id);

    const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);
    const [notes, setNotes] = useState('');

    const [currentUploadIndex, setCurrentUploadIndex] = useState(
        initialIndex ?? 0
    );
    const currentUploadIndexRef = useRef(initialIndex ?? 0);

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        setCurrentUploadIndex(initialIndex ?? 0);
        currentUploadIndexRef.current = initialIndex ?? 0;
    }, [initialIndex]);

    useEffect(() => {
        setNotes(uploads[currentUploadIndex]?.notes ?? '');
    }, [currentUploadIndex, uploads]);

    const [updateUpload] = useMutation(updateUploadMetadataMutation);

    const handleUpdateUpload = async (
        id: string,
        variables: Partial<UploadNode>
    ) => {
        try {
            await updateUpload({
                variables: {
                    id,
                    organization_id: organizationId,
                    ...variables,
                },
            });
            onUpdateUpload?.();
        } catch (error) {
            stadiumToast.error('Failed to update upload');
        }
    };

    const handlePrevious = () => {
        const newIndex = Math.max(currentUploadIndexRef.current - 1, 0);
        if (newIndex !== currentUploadIndexRef.current) {
            setCurrentUploadIndex(newIndex);
            currentUploadIndexRef.current = newIndex;
            onCurrentIndexChange?.(newIndex);
        }
    };

    const handleNext = () => {
        const newIndex = Math.min(
            currentUploadIndexRef.current + 1,
            uploads.length - 1
        );
        if (newIndex !== currentUploadIndexRef.current) {
            setCurrentUploadIndex(newIndex);
            currentUploadIndexRef.current = newIndex;
            onCurrentIndexChange?.(newIndex);
        }
    };

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if any form element is focused
            if (
                document.activeElement &&
                (document.activeElement.tagName === 'INPUT' ||
                    document.activeElement.tagName === 'TEXTAREA')
            ) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, uploads.length]);

    const infoPopoverCells = [
        {
            title: 'Uploaded by',
            description: getNameFromObj(
                uploads[currentUploadIndex]?.uploaded_by_user
            ),
        },
        {
            title: 'Date Modified',
            description: formatDate(
                new Date(uploads[currentUploadIndex]?.updated_at)
            ),
        },
        {
            title: 'Origin',
            description: originHelperFn(
                uploads[currentUploadIndex]?.uploadable_records?.[0]
                    ?.record_type ?? ''
            ),
        },
        {
            title: 'File Type',
            description:
                uploads[currentUploadIndex]?.original_filename
                    ?.split('.')
                    .pop() ?? '',
        },
    ];

    additionalModalInfo?.forEach((info) => {
        infoPopoverCells.splice(info.position, 0, {
            title: info.title,
            description: uploads[currentUploadIndex]
                ? info.getDescription(uploads[currentUploadIndex])
                : '',
        });
    });

    return (
        <Modal
            opened={open}
            onClose={handleClose}
            withinPortal={true}
            fullScreen
            styles={{
                content: {
                    backgroundColor: 'transparent',
                },
                header: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                },
                body: {
                    padding: 0,
                    height: '100vh',
                    width: '100vw',
                    alignContent: 'center',
                    justifyItems: 'center',
                },
            }}
            withCloseButton={false}
        >
            {uploads.length > 0 ? (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!infoPopoverOpen) {
                            handleClose();
                        } else {
                            setInfoPopoverOpen(false);
                        }
                    }}
                    style={{
                        width: '100vw',
                        height: '100vh',
                        alignContent: 'center',
                        justifyItems: 'center',
                    }}
                >
                    <Modal.Header
                        style={{
                            top: '9px',
                            right: '15px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Flex direction="column" gap="8px" align="flex-end">
                            <Flex
                                gap="8px"
                                align="center"
                                style={{
                                    backgroundColor: colors.Gray[50],
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.Gray[200]}`,
                                    padding: '8px',
                                }}
                            >
                                <ActionIcon
                                    onClick={() =>
                                        setInfoPopoverOpen(!infoPopoverOpen)
                                    }
                                    className={classes.actionRoot}
                                    data-active={infoPopoverOpen}
                                >
                                    <InfoCircle
                                        size="20"
                                        color={colors.Gray[600]}
                                    />
                                </ActionIcon>
                                <ActionIcon
                                    className={classes.actionRoot}
                                    onClick={() =>
                                        handleFileDownloadFromUrl(
                                            uploads[currentUploadIndex]
                                                .presigned_url,
                                            uploads[currentUploadIndex]
                                                .original_filename
                                        )
                                    }
                                >
                                    <Download
                                        variant="1"
                                        size="20"
                                        color={colors.Gray[600]}
                                    />
                                </ActionIcon>
                                {(disabledByType
                                    ? !disabledByType(
                                          uploads[currentUploadIndex]
                                              ?.uploadable_records?.[0]
                                              ?.record_type ?? ''
                                      )
                                    : !disabled) && (
                                    <StadiumConfirmActionPopup
                                        getTrigger={(setOpen) => (
                                            <ActionIcon
                                                className={classes.actionRoot}
                                                onClick={() => setOpen(true)}
                                            >
                                                <Trash
                                                    variant="3"
                                                    size="20"
                                                    color={colors.Gray[600]}
                                                />
                                            </ActionIcon>
                                        )}
                                        onConfirm={() => {
                                            const uploadToRemove =
                                                uploads[currentUploadIndex];
                                            if (uploads.length === 1) {
                                                handleClose();
                                            } else if (
                                                currentUploadIndex ===
                                                uploads.length - 1
                                            ) {
                                                handlePrevious();
                                            }
                                            handleRemoveUpload(uploadToRemove);
                                        }}
                                        confirmButtonText="Delete"
                                        title="Delete Upload"
                                        description="Are you sure you want to delete this upload?"
                                    />
                                )}
                                {uploads.length > 1 && (
                                    <>
                                        <Button
                                            disabled={currentUploadIndex === 0}
                                            onClick={handlePrevious}
                                            className={classes.arrowRoot}
                                        >
                                            <Chevron
                                                variant="left"
                                                size="20"
                                                color={colors.Base.Black}
                                            />
                                        </Button>
                                        <Button
                                            disabled={
                                                currentUploadIndex ===
                                                uploads.length - 1
                                            }
                                            onClick={handleNext}
                                            className={classes.arrowRoot}
                                        >
                                            <Chevron
                                                variant="right"
                                                size="20"
                                                color={colors.Base.Black}
                                            />
                                        </Button>
                                    </>
                                )}
                            </Flex>
                            {infoPopoverOpen && (
                                <Flex
                                    direction="column"
                                    gap="24px"
                                    style={{
                                        width: '254px',
                                        backgroundColor: colors.Gray[50],
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.Gray[200]}`,
                                        padding: '16px',
                                    }}
                                >
                                    <Flex
                                        direction="column"
                                        gap="16px"
                                        style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <InfoPopoverCell
                                            title="Name"
                                            description={
                                                uploads[currentUploadIndex]
                                                    ?.display_name ??
                                                uploads[currentUploadIndex]
                                                    ?.original_filename ??
                                                ''
                                            }
                                            onEdit={(value) =>
                                                handleUpdateUpload(
                                                    uploads[currentUploadIndex]
                                                        .id,
                                                    { display_name: value }
                                                )
                                            }
                                        />
                                        <Grid gutter="16px">
                                            {infoPopoverCells.map((cell) => (
                                                <Grid.Col
                                                    key={cell.title}
                                                    span={6}
                                                >
                                                    <InfoPopoverCell
                                                        title={cell.title}
                                                        description={
                                                            cell.description
                                                        }
                                                    />
                                                </Grid.Col>
                                            ))}
                                        </Grid>
                                    </Flex>
                                    <Textarea
                                        label="Notes"
                                        placeholder="Add notes here"
                                        autosize
                                        minRows={3}
                                        maxRows={5}
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        onBlur={(e) => {
                                            e.stopPropagation();
                                            if (
                                                notes !==
                                                uploads[currentUploadIndex]
                                                    .notes
                                            ) {
                                                handleUpdateUpload(
                                                    uploads[currentUploadIndex]
                                                        .id,
                                                    { notes }
                                                );
                                            }
                                        }}
                                    />
                                </Flex>
                            )}
                        </Flex>
                    </Modal.Header>
                    <Flex
                        style={{
                            height: 'calc(100vh - 164px)',
                            width: 'calc(100vw - 96px)',
                            objectFit: 'contain',
                            overflow: 'hidden',
                            borderRadius: '8px',
                        }}
                        align="center"
                        justify="center"
                        gap="16px"
                    >
                        <UploadContent
                            upload={uploads[currentUploadIndex]}
                            borderRadius="8px"
                            interactive={true}
                            handleClick={(e) => {
                                e.stopPropagation();
                                if (infoPopoverOpen) {
                                    setInfoPopoverOpen(false);
                                }
                            }}
                        />
                    </Flex>
                </div>
            ) : null}
        </Modal>
    );
};
