import { Flex } from '@mantine/core';
import {
    SettingsExpandableTabType,
    SettingsTab,
    SettingsTabType,
} from './SettingsTab';

interface SettingsTabsProps {
    tabs: (SettingsTabType | SettingsExpandableTabType)[];
    activeRoute: string;
}

export const SettingsTabs = ({ tabs, activeRoute }: SettingsTabsProps) => {
    return (
        <Flex
            gap="4px"
            direction="column"
            style={{
                width: '153px',
                flexShrink: 0,
                overflow: 'auto',
                scrollbarWidth: 'thin',
            }}
        >
            {tabs.map((tab) => (
                <SettingsTab
                    key={tab.route}
                    tab={tab}
                    activeRoute={activeRoute}
                />
            ))}
        </Flex>
    );
};
