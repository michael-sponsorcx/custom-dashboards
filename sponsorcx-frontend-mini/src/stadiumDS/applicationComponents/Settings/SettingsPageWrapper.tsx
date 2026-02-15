import { SettingsCard } from '@/stadiumDS/applicationComponents/cards/settingsCard';
import { SettingsExpandableTabType, SettingsTabType } from './SettingsTab';
import { SettingsTabs } from './SettingsTabs';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NoTabsSpacing } from './NoTabsSpacing';

interface GetActiveTabProps {
    tabs?: (SettingsTabType | SettingsExpandableTabType)[];
    pathname: string;
}

const getActiveTab = ({
    tabs,
    pathname,
}: GetActiveTabProps): SettingsTabType | undefined => {
    if (!tabs?.length) {
        return undefined;
    }

    for (const tab of tabs) {
        if ('subTabs' in tab) {
            const activeSubTab = getActiveTab({
                tabs: tab.subTabs,
                pathname,
            });
            if (activeSubTab) {
                return activeSubTab;
            }
        } else if (pathname.endsWith(`/${tab.route}`)) {
            return tab;
        }
    }

    return undefined;
};

const getFirstTab = (
    tabs?: (SettingsTabType | SettingsExpandableTabType)[]
): SettingsTabType | undefined => {
    if (!tabs?.length) {
        return undefined;
    }

    for (const tab of tabs) {
        if ('subTabs' in tab) {
            return getFirstTab(tab.subTabs);
        } else {
            return tab;
        }
    }

    return undefined;
};

type SettingsPageWrapperProps = {
    tabs?: (SettingsTabType | SettingsExpandableTabType)[];
    children?: React.ReactNode;
} & (
    | {
          tabs: (SettingsTabType | SettingsExpandableTabType)[];
      }
    | {
          children: React.ReactNode;
      }
);

export const SettingsPageWrapper = ({
    children,
    tabs,
}: SettingsPageWrapperProps) => {
    const location = useLocation();

    const activeTab: SettingsTabType | undefined =
        getActiveTab({
            tabs,
            pathname: location.pathname,
        }) ?? getFirstTab(tabs);

    return (
        <>
            {tabs && tabs.length > 0 ? (
                <SettingsTabs
                    tabs={tabs}
                    activeRoute={activeTab?.route || tabs[0].route}
                />
            ) : null}
            <SettingsCard>
                {activeTab ? <activeTab.component /> : children}
            </SettingsCard>
            {!tabs || tabs.length === 0 ? <NoTabsSpacing /> : null}
        </>
    );
};
