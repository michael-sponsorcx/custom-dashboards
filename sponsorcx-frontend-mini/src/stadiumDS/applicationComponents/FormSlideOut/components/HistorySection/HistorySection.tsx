import { Stack } from '@mantine/core';
import { MainPanelSection } from '../MainPanelSection';
import { HistoryActionType, RecordHistoryGroup } from './HistorySection.type';
import historySectionClasses from './HistorySection.module.css';
import { HistoryGroup } from './HistoryGroup';
import { HistoryItem } from './HistoryItem';

interface HistorySectionProps {
    title?: string;
    history: RecordHistoryGroup[];
    actionType: HistoryActionType;
}

export const HistorySection = ({
    title = 'History',
    history,
    actionType,
}: HistorySectionProps) => {
    return (
        <MainPanelSection title={title}>
            <Stack gap="4px">
                {history.map((group, index) => (
                    <div
                        key={index}
                        className={historySectionClasses.historyItem}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {group.items.length > 1 ? (
                            <HistoryGroup
                                lastItem={index === history.length - 1}
                                recordHistoryGroup={group}
                                actionType={actionType}
                            />
                        ) : (
                            <HistoryItem
                                lastItem={index === history.length - 1}
                                item={group.items[0]}
                                actionType={actionType}
                            />
                        )}
                    </div>
                ))}
            </Stack>
        </MainPanelSection>
    );
};
