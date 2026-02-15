import { Tabs } from '@mantine/core';
import { PropsWithChildren } from 'react';
import * as Styled from './SlideOut.styles';
import { TabItem } from './SlideOut.types';

interface SlideOutTabsProps {
    additionalTabs: TabItem[];
}

export const SlideOutTabs = ({
    additionalTabs,
    children,
}: PropsWithChildren<SlideOutTabsProps>) => {
    return (
        <Tabs defaultValue="general" styles={{ root: { height: '100%' } }}>
            <Tabs.List>
                <Tabs.Tab value="general">General</Tabs.Tab>
                {additionalTabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value}>
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            <Tabs.Panel value="general">
                <Styled.Content $noPadding={false}>{children}</Styled.Content>
            </Tabs.Panel>
            {additionalTabs.map((tab) => (
                <Tabs.Panel key={tab.value} value={tab.value}>
                    <Styled.Content $noPadding={false}>
                        {tab.content}
                    </Styled.Content>
                </Tabs.Panel>
            ))}
        </Tabs>
    );
};
