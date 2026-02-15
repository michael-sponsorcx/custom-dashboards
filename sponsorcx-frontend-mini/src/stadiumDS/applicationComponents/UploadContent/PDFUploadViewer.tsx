import colors from '@/stadiumDS/foundations/colors';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import ZoomIn from '@/stadiumDS/foundations/icons/Editor/ZoomIn';
import ZoomOut from '@/stadiumDS/foundations/icons/Editor/ZoomOut';
import { ActionIcon, Flex, Text } from '@mantine/core';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'styled-components/macro';
import '@/config/pdfJsConfig';
import { useS3Resource } from '@/hooks/useS3Resources';
import { MinimalUpload } from './UploadContent';

interface PDFUploadViewerProps {
    upload?: MinimalUpload;
    onUploadError?: () => void;
    handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const PDFUploadViewer = ({
    upload,
    onUploadError,
    handleClick,
}: PDFUploadViewerProps) => {
    const presignedUrl = useS3Resource(upload?.s3_key);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomHasBeenClicked, setZoomHasBeenClicked] = useState(false);

    return (
        <>
            <Flex
                direction="column"
                align="center"
                justify="center"
                gap="16px"
                style={{
                    padding: '32px 18px 64px',
                    backgroundColor: colors.Gray[100],
                    borderRadius: '12px',
                    border: `1px solid ${colors.Gray[200]}`,
                    maxHeight: '100%',
                    position: 'relative',
                }}
                onClick={(e) => handleClick?.(e)}
            >
                <Document
                    file={presignedUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    onLoadError={() => onUploadError?.()}
                    css={`
                        justify-items: center;
                        overflow-y: auto;
                        scrollbar-width: thin;
                        height: 100%;
                        padding: 0;
                        margin: 0;
                        width: fit-content;
                    `}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        scale={zoomLevel}
                        css={`
                            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
                            border-radius: 6px;
                            overflow: hidden;
                            margin: 0;
                            padding: 0;
                            width: fit-content;
                        `}
                    />
                </Document>
                <Flex
                    gap="8px"
                    style={{
                        flexShrink: 0,
                        position: 'absolute',
                        bottom: '20px',
                    }}
                >
                    <ActionIcon
                        onClick={() =>
                            setPageNumber(Math.max(pageNumber - 1, 1))
                        }
                    >
                        <Chevron
                            variant="left"
                            color={colors.Gray[600]}
                            size="20"
                        />
                    </ActionIcon>
                    <Text
                        c={colors.Gray[600]}
                        fw={500}
                        data-testid="pdf-page-numbers"
                    >
                        {pageNumber} / {numPages}
                    </Text>
                    <ActionIcon
                        onClick={() =>
                            setPageNumber(Math.min(pageNumber + 1, numPages))
                        }
                    >
                        <Chevron
                            variant="right"
                            color={colors.Gray[600]}
                            size="20"
                        />
                    </ActionIcon>
                </Flex>
            </Flex>
            <Flex
                gap="8px"
                style={{
                    flexShrink: 0,
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <ActionIcon
                    onClick={() => {
                        setZoomHasBeenClicked(true);
                        setZoomLevel(zoomLevel - 0.1);
                    }}
                    disabled={zoomLevel < 0.6}
                >
                    <ZoomOut
                        size="16"
                        color={
                            zoomHasBeenClicked
                                ? colors.Gray[600]
                                : colors.Gray[400]
                        }
                    />
                </ActionIcon>
                <Text
                    c={zoomHasBeenClicked ? colors.Gray[600] : colors.Gray[400]}
                    fw={500}
                    style={{ width: '40px', textAlign: 'center' }}
                >
                    {Math.round(zoomLevel * 100)}%
                </Text>
                <ActionIcon
                    onClick={() => {
                        setZoomHasBeenClicked(true);
                        setZoomLevel(zoomLevel + 0.1);
                    }}
                    disabled={zoomLevel > 1.5}
                >
                    <ZoomIn
                        size="16"
                        color={
                            zoomHasBeenClicked
                                ? colors.Gray[600]
                                : colors.Gray[400]
                        }
                    />
                </ActionIcon>
            </Flex>
        </>
    );
};
