import colors from '@/stadiumDS/foundations/colors';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import { SlideOut } from '@/stadiumDS/sharedComponents/SlideOut';
import { ActionIcon, Group, Stack } from '@mantine/core';
import ThreeDotMenu, {
    ThreeDotMenuOption,
} from '../PageHeader/components/ThreeDotMenu';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
    MainPanelHeader,
    MainPanelHeaderProps,
} from './components/MainPanelHeader';
import { FormSlideOutTab } from './FormSlideOut.type';

interface FormSlideOutProps {
    isOpen: boolean;
    onClose: () => void;
    threeDotMenuOptions?: ThreeDotMenuOption[];
    header?: MainPanelHeaderProps;
    tabs: [FormSlideOutTab, ...FormSlideOutTab[]];
    sidePanelContent?: ReactNode;
    extraHeaderButtons?: ReactNode;
}

export const FormSlideOut = ({
    isOpen,
    onClose,
    threeDotMenuOptions,
    header,
    tabs,
    sidePanelContent,
    extraHeaderButtons,
}: FormSlideOutProps) => {
    const [activeTabKey, setActiveTabKey] = useState(tabs[0].key);

    // Reset to first tab when slideout closes
    useEffect(() => {
        if (!isOpen) {
            setActiveTabKey(tabs[0].key);
        }
    }, [isOpen, tabs]);

    const activeTab = useMemo(
        () => tabs.find((t) => t.key === activeTabKey) ?? tabs[0],
        [activeTabKey, tabs]
    );

    return (
        <SlideOut
            isOpen={isOpen}
            onClose={onClose}
            width="865px"
            minWidth="779px"
            maxWidth="954px"
            hideCloseButton
            noBodyPadding
        >
            {/* Container */}
            <Group gap="0" h="100vh" flex="1" style={{ overflowY: 'hidden' }}>
                {/* Main Panel */}
                <Stack
                    gap="0"
                    h="100vh"
                    flex="1"
                    style={{ overflowY: 'hidden', position: 'relative' }}
                >
                    {/* Header Buttons */}
                    <Group
                        justify="space-between"
                        style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            right: '16px',
                        }}
                    >
                        <ActionIcon onClick={onClose}>
                            <Chevron
                                color={colors.Gray[600]}
                                size={'24'}
                                variant={'right-double'}
                            />
                        </ActionIcon>
                        <Group align="end">
                            {extraHeaderButtons}
                            {threeDotMenuOptions &&
                            threeDotMenuOptions.length > 0 ? (
                                <ThreeDotMenu options={threeDotMenuOptions} />
                            ) : null}
                        </Group>
                    </Group>
                    {/* Header */}
                    {header && (
                        <MainPanelHeader
                            {...header}
                            tabs={tabs}
                            activeTabKey={activeTabKey}
                            setActiveTabKey={setActiveTabKey}
                        />
                    )}
                    {/* Content */}
                    <Stack
                        gap="32px"
                        style={{
                            padding: '24px 48px',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            flexGrow: 1,
                        }}
                    >
                        {activeTab.content}
                    </Stack>
                </Stack>
                {/* Side Panel */}
                <Stack
                    w="320px"
                    h="100vh"
                    style={{
                        padding: '48px 24px 24px',
                        borderLeft: `1px solid ${colors.Gray[200]}`,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'thin',
                        gap: '24px',
                    }}
                >
                    {sidePanelContent}
                </Stack>
            </Group>
        </SlideOut>
    );
};
