import { Flex } from '@mantine/core';

interface PageWrapperProps {
    children: React.ReactNode;
    padding?: string;
}

export const PageWrapper = ({
    children,
    padding = '16px 24px',
}: PageWrapperProps) => {
    return (
        <Flex direction="column" gap="14px" style={{ width: '100%', padding }}>
            {children}
        </Flex>
    );
};
