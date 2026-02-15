import { Text, TextProps, Tooltip } from '@mantine/core';
import { useRef, useState, useLayoutEffect } from 'react';

interface TextWithTooltipProps extends TextProps {
    text: string;
    tooltip?: string;
    withinPortal?: boolean;
}

export const TextWithTooltip = ({
    text,
    tooltip = text,
    withinPortal = true,
    ...props
}: TextWithTooltipProps) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useLayoutEffect(() => {
        const element = textRef.current;
        if (!element) return;

        // Check if text is truncated
        const isTextTruncated = element.scrollWidth > element.clientWidth;
        setIsTruncated(isTextTruncated);
    }, [text]); // Re-check when text changes

    return (
        <Tooltip
            label={tooltip}
            withinPortal={withinPortal}
            disabled={!isTruncated}
        >
            <Text
                {...props}
                style={{
                    fontWeight: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    textDecoration: 'inherit',
                    textTransform: 'inherit',
                    ...props.style,
                }}
                ref={textRef}
                truncate
            >
                {text}
            </Text>
        </Tooltip>
    );
};
