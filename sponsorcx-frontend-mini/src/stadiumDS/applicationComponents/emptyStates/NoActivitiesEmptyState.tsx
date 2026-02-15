import { Button } from '@mantine/core';
import GenericListEmptyState from './GenericListEmptyState';
import Grid from '@/stadiumDS/foundations/icons/Layout/Grid';
import colors from '@/stadiumDS/foundations/colors';
import Activity from '@/stadiumDS/foundations/icons/General/Activity';

const NoActivitiesEmptyState = ({
    setCreateSlidePanelOpen,
}: {
    setCreateSlidePanelOpen: (open: boolean) => void;
}) => {
    return (
        <GenericListEmptyState
            icon={<Activity color={colors.Gray[700]} size={'24'} />}
            title="No Activities"
            description="Add an activity to start tracking your partnerships"
            button={
                <Button
                    onClick={() => {
                        setCreateSlidePanelOpen(true);
                    }}
                >
                    Add Activity
                </Button>
            }
            includeOuterRings
        />
    );
};

export default NoActivitiesEmptyState;
