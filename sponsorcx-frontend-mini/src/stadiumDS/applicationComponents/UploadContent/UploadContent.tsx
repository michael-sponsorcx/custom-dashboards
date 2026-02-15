import { UploadNode } from '@/hooks/useUniversalUploadList';
import colors from '@/stadiumDS/foundations/colors';
import PlayCircle from '@/stadiumDS/foundations/icons/Media/PlayCircle';
import { Flex, Text } from '@mantine/core';
import { PDFUploadViewer } from './PDFUploadViewer';
import 'styled-components/macro';
import { useS3Resource } from '@/hooks/useS3Resources';
import { FileIcon } from '@/stadiumDS/sharedComponents/Upload/FileIcon';

export type MinimalUpload = Pick<
    UploadNode,
    's3_key' | 'original_filename' | 'content_type' | 'display_name'
>;

interface UploadContentProps {
    upload?: MinimalUpload | null;
    borderRadius?: string;
    interactive?: boolean;
    playIconSize?: string;
    handleClick?: (e: React.MouseEvent) => void;
    documentScale?: number;
}

export const UploadContent = ({
    upload,
    borderRadius = '6px',
    interactive = false,
    playIconSize = '24',
    handleClick,
    documentScale = 1,
}: UploadContentProps) => {
    const url = useS3Resource(upload?.s3_key);
    const fileType = upload?.original_filename?.split('.').pop() ?? '';

    if (upload?.content_type?.includes('image')) {
        return (
            <img
                src={url}
                style={{
                    borderRadius,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                }}
                onClick={(e) => handleClick?.(e)}
            />
        );
    } else if (upload?.content_type?.includes('video')) {
        if (interactive) {
            return (
                <video
                    src={url}
                    style={{
                        borderRadius,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                    }}
                    onClick={(e) => handleClick?.(e)}
                    controls
                />
            );
        }
        return (
            <Flex
                style={{
                    position: 'relative',
                }}
                align="center"
                justify="center"
                onClick={(e) => handleClick?.(e)}
            >
                <video
                    src={url}
                    style={{
                        borderRadius,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                    }}
                />
                <Flex
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.Gray[700],
                        opacity: 0.25,
                        borderRadius,
                    }}
                    align="center"
                    justify="center"
                >
                    <PlayCircle size={playIconSize} color={colors.Base.White} />
                </Flex>
            </Flex>
        );
    } else if (upload?.content_type?.includes('audio')) {
        if (interactive) {
            return (
                <Flex
                    gap="16px"
                    direction="column"
                    style={{
                        borderRadius: '12px',
                        maxWidth: '100%',
                        backgroundColor: colors.Gray[100],
                        border: `1px solid ${colors.Gray[200]}`,
                        padding: '16px',
                    }}
                    onClick={(e) => handleClick?.(e)}
                >
                    <Text fw={500} style={{ fontSize: '18px' }}>
                        {upload?.display_name ?? upload?.original_filename}
                    </Text>
                    <audio
                        src={url}
                        controls
                        css={`
                            width: 764px;
                            height: 36px;

                            ::-webkit-media-controls-panel {
                                background-color: ${colors.Gray[300]};
                            }
                        `}
                    />
                </Flex>
            );
        }
        return (
            <FileIcon
                fileType={fileType}
                scale={documentScale}
                handleClick={handleClick}
            />
        );
    } else if (upload?.content_type?.includes('pdf') && interactive) {
        return <PDFUploadViewer upload={upload} handleClick={handleClick} />;
    } else if (interactive) {
        return (
            <Flex
                gap="16px"
                direction="column"
                style={{
                    borderRadius: '12px',
                    maxWidth: '100%',
                    backgroundColor: colors.Gray[100],
                    border: `1px solid ${colors.Gray[200]}`,
                    padding: '16px',
                }}
                onClick={(e) => handleClick?.(e)}
            >
                <Text fw={500} style={{ fontSize: '18px' }}>
                    Preview Not Available
                </Text>
                <Text>
                    We do not yet support this file type, but you can download
                    the file to view it.
                </Text>
            </Flex>
        );
    }
    return (
        <FileIcon
            fileType={fileType}
            scale={documentScale}
            handleClick={handleClick}
        />
    );
};
