import { Resizable, ResizeCallback } from 're-resizable';
import { useState, useEffect, useRef, PropsWithChildren } from 'react';
import X from '../../foundations/icons/General/X';
import * as Styled from './SlideOut.styles';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { ActionIcon, Overlay } from '@mantine/core';
import { Text } from '@mantine/core';
import { SlideOutTabs } from './SlideOutTabs';
import { TabItem } from './SlideOut.types';

interface SlideOutProps {
    isOpen: boolean;
    width?: string;
    zIndex?: number;
    minWidth?: string;
    maxWidth?: string;
    onResizeWidth?: (width: string) => void;
    onClose: () => void;
    preventResize?: boolean;
    headerTitle?: string | React.ReactNode;
    headerSubTitle?: string;
    footerContent?: React.ReactNode;
    additionalTabs?: TabItem[];
    hideCloseButton?: boolean;
    noBodyPadding?: boolean;
}

export const SlideOut = ({
    children,
    isOpen,
    width: initialWidth = '300px',
    zIndex = 1000,
    minWidth = '200px',
    maxWidth = '600px',
    onResizeWidth,
    onClose,
    preventResize = false,
    headerTitle,
    headerSubTitle,
    footerContent,
    additionalTabs,
    hideCloseButton = false,
    noBodyPadding = false,
}: PropsWithChildren<SlideOutProps>) => {
    const [width, setWidth] = useState(initialWidth);
    const outsideClickRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (initialWidth !== width) {
            setWidth(initialWidth);
        }
    }, [initialWidth]);

    const handleResize: ResizeCallback = (_e, _direction, ref) => {
        const newWidth = ref.style.width;
        setWidth(newWidth);
        onResizeWidth?.(newWidth);
    };

    const hideHeader = !headerTitle && !headerSubTitle;
    const slideOutHasTabs = !!additionalTabs?.length;
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const footerHeight = footerRef.current?.offsetHeight || 0;

    return (
        <>
            {isOpen && (
                <Overlay
                    backgroundOpacity={0}
                    fixed
                    onClick={() => onClose()}
                />
            )}
            <Styled.Container
                ref={outsideClickRef}
                $isOpen={isOpen}
                $zIndex={zIndex}
            >
                <Resizable
                    size={{ width, height: '100%' }}
                    minWidth={minWidth}
                    maxWidth={maxWidth}
                    enable={{
                        top: false,
                        right: false,
                        bottom: false,
                        left: !preventResize,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    handleComponent={{
                        left: <Styled.Handle />,
                    }}
                    onResizeStop={handleResize}
                >
                    {!hideCloseButton && (
                        <Styled.CloseButtonContainer>
                            <ActionIcon
                                data-test-id="slideout-close"
                                onClick={() => onClose()}
                            >
                                <X
                                    color={primaryColors.Gray[600]}
                                    size={'24'}
                                />
                            </ActionIcon>
                        </Styled.CloseButtonContainer>
                    )}

                    {!hideHeader && (
                        <Styled.SlideOutHeader
                            $slideOutHasTabs={slideOutHasTabs}
                            ref={headerRef}
                        >
                            {headerTitle ? (
                                typeof headerTitle === 'string' ? (
                                    <Text size={'2xl'} fw={600} truncate>
                                        {headerTitle}
                                    </Text>
                                ) : (
                                    headerTitle
                                )
                            ) : null}
                            {headerSubTitle && (
                                <Text
                                    size="sm"
                                    fw={400}
                                    c={primaryColors.Gray[600]}
                                >
                                    {headerSubTitle}
                                </Text>
                            )}
                        </Styled.SlideOutHeader>
                    )}

                    {additionalTabs ? (
                        <SlideOutTabs additionalTabs={additionalTabs}>
                            {children}
                        </SlideOutTabs>
                    ) : (
                        <Styled.Content
                            $noPadding={noBodyPadding}
                            $offsetHeight={headerHeight + footerHeight}
                        >
                            {children}
                        </Styled.Content>
                    )}

                    {footerContent && (
                        <Styled.SlideOutFooter ref={footerRef}>
                            {footerContent}
                        </Styled.SlideOutFooter>
                    )}
                </Resizable>
            </Styled.Container>
        </>
    );
};
