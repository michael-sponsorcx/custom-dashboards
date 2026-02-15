import { Divider } from '@mantine/core';
import { TasksSectionRowProps } from './TasksSection.type';
import { MainTaskInfo } from './MainTaskInfo';
import { ScxTile } from '@/components/ScxTile';
import { TasksSectionRowExpandedContent } from './TasksSectionRowExpandedContent';
import colors from '@/stadiumDS/foundations/colors';

export const TasksSectionRow = (props: TasksSectionRowProps) => {
    const { isTileView } = props;

    if (isTileView) {
        return (
            <ScxTile
                expanded
                expandedContent={<TasksSectionRowExpandedContent {...props} />}
                padding="10px"
                borderColor={props.task.overdue ? colors.Error[500] : undefined}
            >
                <MainTaskInfo {...props} />
            </ScxTile>
        );
    }

    return (
        <>
            <MainTaskInfo {...props} />
            <Divider />
        </>
    );
};
