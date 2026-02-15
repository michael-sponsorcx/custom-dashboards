import { Text, Tooltip } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

export interface AssetTextTruncateProps {
    text: string;
    truncateAt?: number;
}

export const AssetTextTruncate = ({
    text,
    truncateAt = 30,
}: AssetTextTruncateProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (el) {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        }
    }, [ref.current]);

    return (
        <Tooltip
            multiline
            disabled={!isTruncated}
            label={text}
            zIndex={1001}
            w={text.length > truncateAt ? 300 : undefined}
            withinPortal
        >
            <Text span ref={ref} truncate="end">
                {text}
            </Text>
        </Tooltip>
    );
};
