import { CXLink } from '@/components/CXLink';
import { Group, Text } from '@mantine/core';
import { ReadOnlyLinkFieldProps } from './SidePanelFields.types';
import colors from '@/stadiumDS/foundations/colors';

export const SidePanelReadOnlyLinkField = ({
    value,
    to,
    icon,
}: Omit<ReadOnlyLinkFieldProps, 'type'>) => {
    return (
        <CXLink to={to} cssProp={`color: ${colors.Brand[400]};`}>
            <Group wrap="nowrap" style={{ gap: '8px' }}>
                {icon}
                <Text truncate>{value}</Text>
            </Group>
        </CXLink>
    );
};
