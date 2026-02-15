import { Flex, Collapse, Text } from '@mantine/core';
import * as S from './SettingsTab.styles';
import colors from '@/stadiumDS/foundations/colors';
import { useRouteMatch } from 'react-router-dom';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import { useState } from 'react';

type SettingsTabBase = {
    label: string;
    route: string;
};

export type SettingsTabType = SettingsTabBase & {
    component: () => JSX.Element;
};

export type SettingsExpandableTabType = SettingsTabBase & {
    storageKey: string;
    subTabs: SettingsTabType[];
};

const isExpandableTab = (
    tab: SettingsTabType | SettingsExpandableTabType
): tab is SettingsExpandableTabType => {
    return 'subTabs' in tab;
};

interface SettingsTabProps {
    tab: SettingsTabType | SettingsExpandableTabType;
    activeRoute: string;
    isSubTab?: boolean;
}

export const SettingsTab = ({
    tab,
    activeRoute,
    isSubTab,
}: SettingsTabProps) => {
    const { url } = useRouteMatch();

    const active =
        activeRoute === tab.route ||
        (isExpandableTab(tab) &&
            tab.subTabs.some((subTab) => subTab.route === activeRoute));

    const [expanded, setExpanded] = useState(
        isExpandableTab(tab)
            ? localStorage.getItem(
                  `stadium-settings-expanded-tabs-${tab.storageKey}`
              ) === 'true'
            : false
    );

    if (isExpandableTab(tab)) {
        return (
            <S.ExpandableTabContainer
                $active={active}
                $expanded={expanded}
                onClick={() => {
                    localStorage.setItem(
                        `stadium-settings-expanded-tabs-${tab.storageKey}`,
                        expanded ? 'false' : 'true'
                    );
                    setExpanded(!expanded);
                }}
            >
                <Flex justify="space-between" align="center">
                    <Text fw={500} c={colors.Gray[500]}>
                        {tab.label}
                    </Text>
                    <S.ChevronContainer $expanded={expanded}>
                        <Chevron
                            variant="down"
                            size="20"
                            color={colors.Gray[400]}
                        />
                    </S.ChevronContainer>
                </Flex>
                <Collapse in={expanded}>
                    <Flex direction="column" gap="4px">
                        {tab.subTabs.map((subTab) => (
                            <SettingsTab
                                key={subTab.route}
                                tab={subTab}
                                activeRoute={activeRoute}
                                isSubTab
                            />
                        ))}
                    </Flex>
                </Collapse>
            </S.ExpandableTabContainer>
        );
    }

    return (
        <S.TabContainer
            to={`${url}/${tab.route}`}
            $active={active}
            $isSubTab={isSubTab}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <Text
                fw={active ? 600 : 500}
                c={colors.Gray[active ? 700 : 500]}
                data-active={active}
            >
                {tab.label}
            </Text>
        </S.TabContainer>
    );
};
