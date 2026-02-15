import { PaperclipIcon } from '@/assets/icons/Paperclip';
import { mediaAccept } from '@/components/Media';
import { useFileUploader } from '@/hooks/useFileUploader';
import {
    UploadNode,
    useUniversalUploadList,
} from '@/hooks/useUniversalUploadList';
import { stadiumToast } from '@/stadiumDS/applicationComponents/Toasts/StadiumToast.helpers';
import { UploadModal } from '@/stadiumDS/applicationComponents/UploadModal/UploadModal';
import { fileSizeHelper } from '@/stadiumDS/applicationComponents/UploadsPage/helpers/FileSizeHelper';
import colors from '@/stadiumDS/foundations/colors';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as S from './Files.styles';
import { FileButton } from './FileButton';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';

export interface FilesProps {
    recordType: string;
    recordId: string;
    refetch?: () => void;
    refetchQueries?: string[];
    uploads: UploadNode[];
    hoveringUploadIds?: string[];
    originHelperFn: (recordType: string) => string;
    uploadRequired?: boolean;
    wrap?: boolean;
    uploadModalTrigger?: number;
    highlightRequiredFields?: boolean;
    callbackFn?: (files: File[]) => void;
    disabled?: boolean;
    disabledByType?: (recordType: string) => boolean;
    handleUpload?: (files: File[]) => Promise<void>;
    handleDelete?: (ids: string[]) => Promise<void>;
}

export const Files = ({
    recordType,
    recordId,
    refetch,
    refetchQueries,
    uploads,
    hoveringUploadIds,
    originHelperFn,
    uploadRequired = false,
    wrap = true,
    uploadModalTrigger,
    highlightRequiredFields = false,
    callbackFn,
    disabled = false,
    disabledByType,
    handleUpload: parentHandleUpload,
    handleDelete: parentHandleDelete,
}: FilesProps) => {
    const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
        null
    );
    const { handleDelete: defaultHandleDelete } = useUniversalUploadList({
        recordType,
        onDelete: refetch,
        refetchQueries,
        viewPermission: undefined,
        editPermission: undefined,
    });

    const handleDelete = parentHandleDelete || defaultHandleDelete;

    const {
        setLoadingFiles,
        uploading,
        handleUpload: defaultHandleUpload,
    } = useFileUploader({
        recordType,
        recordId,
        onUploadComplete: refetch,
        refetchQueries,
    });

    const handleUpload = parentHandleUpload || defaultHandleUpload;

    const { getRootProps, getInputProps } = useDropzone({
        noClick: uploading,
        noDrag: uploading,
        accept: mediaAccept,
        disabled: uploading,
        onDrop: async (acceptedFiles: File[]) => {
            if (isEmpty(acceptedFiles)) {
                stadiumToast.error('File not accepted.');
                return;
            }
            if (fileSizeHelper(acceptedFiles)) {
                setLoadingFiles(true);
                try {
                    await handleUpload(acceptedFiles);
                    callbackFn?.(acceptedFiles);
                } finally {
                    setLoadingFiles(false);
                }
            }
        },
    });

    useEffect(() => {
        if (uploadModalTrigger) {
            setSelectedFileIndex(0);
        }
    }, [uploadModalTrigger]);

    const shouldHighlightUpload =
        highlightRequiredFields && uploadRequired && uploads.length === 0;

    return (
        <S.Container>
            <S.Grid $wrap={wrap}>
                {uploadRequired && <StadiumRequiredIndicator />}
                {uploads.map((image: UploadNode, index: number) => (
                    <FileButton
                        key={image.id}
                        image={image}
                        handleDelete={() => handleDelete([image.id])}
                        highlight={
                            hoveringUploadIds?.includes(image.id) ?? false
                        }
                        onImageClick={() => setSelectedFileIndex(index)}
                        disabled={
                            disabledByType
                                ? disabledByType(
                                      image.uploadable_records?.[0]
                                          ?.record_type ?? ''
                                  )
                                : disabled
                        }
                    />
                ))}
                {!disabled && (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input
                            {...getInputProps()}
                            disabled={uploading || disabled}
                        />
                        <S.FileUploadButton
                            $highlight={shouldHighlightUpload}
                            $disabled={uploading || disabled}
                        >
                            <PaperclipIcon color={colors.Gray[300]} size="16" />
                        </S.FileUploadButton>
                    </div>
                )}
            </S.Grid>
            <UploadModal
                open={selectedFileIndex !== null}
                onClose={() => setSelectedFileIndex(null)}
                uploads={uploads}
                handleRemoveUpload={(upload) => handleDelete([upload.id])}
                initialIndex={selectedFileIndex}
                originHelperFn={originHelperFn}
                onUpdateUpload={() => refetch?.()}
                disabled={disabled}
                disabledByType={disabledByType}
            />
        </S.Container>
    );
};
