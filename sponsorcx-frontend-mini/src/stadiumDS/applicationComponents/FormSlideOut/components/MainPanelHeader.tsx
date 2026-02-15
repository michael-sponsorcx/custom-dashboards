import colors from '@/stadiumDS/foundations/colors';
import { AutoSizeTextInput } from '@/stadiumDS/sharedComponents/AutoSizeTextInput';
import { Divider, Stack, Tabs } from '@mantine/core';
import { FormSlideOutTab } from '../FormSlideOut.type';

type EditableItemProps = {
    value: string;
    placeholder: string;
} & (
    | {
          onUpdate: (value: string) => void;
          editable?: true;
          disabled?: boolean;
      }
    | {
          editable: false;
      }
);

export interface MainPanelHeaderProps {
    title: EditableItemProps & { highlightWhenEmpty?: boolean };
    description?: EditableItemProps;
}

export const MainPanelHeader = ({
    title,
    description,
    tabs,
    activeTabKey,
    setActiveTabKey,
}: MainPanelHeaderProps & {
    tabs: [FormSlideOutTab, ...FormSlideOutTab[]];
    activeTabKey: string;
    setActiveTabKey: (tabKey: string) => void;
}) => {
    const isTitleEditable = title.editable !== false;
    const isDescriptionEditable = description?.editable !== false;

    return (
        <Stack style={{ gap: tabs.length > 1 ? '20px' : '24px' }}>
            <Stack style={{ gap: '4px', padding: '48px 48px 0' }}>
                <AutoSizeTextInput
                    defaultValue={title.value}
                    placeholder={title.placeholder}
                    onUpdate={isTitleEditable ? title.onUpdate : () => null}
                    disabled={isTitleEditable ? title.disabled : true}
                    styles={{
                        input: {
                            border: 'none',
                            borderBottom:
                                title.highlightWhenEmpty && !title.value.length
                                    ? `1px solid ${colors.Error[500]}`
                                    : 'none',
                            color: colors.Base.Black,
                            fontSize: '30px',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: '38px',
                            borderRadius: '0px',
                            cursor: isTitleEditable ? undefined : 'text',
                        },
                        root: {
                            marginBottom: '4px',
                        },
                    }}
                />
                {description && (
                    <AutoSizeTextInput
                        defaultValue={description.value}
                        placeholder={description.placeholder}
                        onUpdate={
                            isDescriptionEditable
                                ? description.onUpdate
                                : () => null
                        }
                        disabled={
                            isDescriptionEditable ? description.disabled : true
                        }
                        styles={{
                            input: {
                                border: 'none',
                                color: colors.Gray[600],
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '18px',
                                borderRadius: '0px',
                                cursor: isDescriptionEditable
                                    ? undefined
                                    : 'text',
                            },
                        }}
                    />
                )}
            </Stack>
            {tabs.length > 1 ? (
                <Tabs
                    value={activeTabKey}
                    onChange={(value) => setActiveTabKey(value ?? tabs[0].key)}
                >
                    <Tabs.List style={{ padding: '0 48px' }}>
                        {tabs.map((tab) => (
                            <Tabs.Tab
                                key={tab.key}
                                value={tab.key}
                                style={{
                                    padding: '4px 4px 12px',
                                }}
                            >
                                {tab.label}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs>
            ) : (
                <Divider style={{ width: '100%' }} />
            )}
        </Stack>
    );
};
