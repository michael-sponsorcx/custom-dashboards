import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';
import { Group, Text } from '@mantine/core';
import { sidePanelFieldPlaceholderColor } from './SidePanelFields.types';
import colors from '@/stadiumDS/foundations/colors';

interface SidePanelFieldLabelProps {
    label: string;
    required?: boolean;
    icon?: React.ReactNode;
    highlight?: boolean;
}

export const SidePanelFieldLabel = ({
    label,
    required,
    icon,
    highlight,
}: SidePanelFieldLabelProps) => {
    return (
        <Group
            wrap="nowrap"
            style={{
                gap: '8px',
                ...(highlight
                    ? {
                          border: `1px solid ${colors.Error[500]}`,
                      }
                    : {}),
                maxWidth: '100%',
                overflow: 'hidden',
            }}
        >
            {icon ? <Group style={{ flexShrink: 0 }}>{icon}</Group> : null}
            <Group
                style={{ gap: '2px', maxWidth: '100%', overflow: 'hidden' }}
                wrap="nowrap"
            >
                <Text c={sidePanelFieldPlaceholderColor} truncate>
                    {label}
                </Text>
                {required && <StadiumRequiredIndicator />}
            </Group>
        </Group>
    );
};
