import { Flex } from '@mantine/core';
import { useWindowSize } from 'react-use';

export const NoTabsSpacing = () => {
    const { width } = useWindowSize();

    if (width < 1300) {
        return null;
    }

    return (
        <Flex
            style={{
                width: '153px',
                flexShrink: 0,
            }}
        />
    );
};
