import Check from '@/stadiumDS/foundations/icons/General/Check';
import GenericListEmptyState from './GenericListEmptyState';
import colors from '@/stadiumDS/foundations/colors';
import { Button } from '@mantine/core';

interface NoTasksEmptyStateProps {
    handleClick: () => void;
}

export const NoTasksEmptyState = ({ handleClick }: NoTasksEmptyStateProps) => {
    return (
        <GenericListEmptyState
            icon={
                <Check
                    variant="circle-broken"
                    color={colors.Gray[700]}
                    size="24"
                />
            }
            title="No Tasks"
            description="Create your first task to get started"
            button={<Button onClick={handleClick}>Add Task</Button>}
            includeOuterRings
        />
    );
};
