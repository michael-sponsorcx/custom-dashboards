import { Button } from '@mantine/core';
import GenericListEmptyState from './GenericListEmptyState';
import Grid from '@/stadiumDS/foundations/icons/Layout/Grid';
import colors from '@/stadiumDS/foundations/colors';
import { useUserStore } from '@/stores/userStore';

const NoAssetsEmptyState = ({
    setCreateSlidePanelOpen,
    hideButton = false,
}: {
    setCreateSlidePanelOpen: (open: boolean) => void;
    hideButton?: boolean;
}) => {
    const { isBrandPartnerUser } = useUserStore();

    return (
        <GenericListEmptyState
            icon={<Grid color={colors.Gray[700]} size={'24'} variant="1" />}
            title="No Assets"
            description="Create your first asset to track on live memo"
            button={
                isBrandPartnerUser || hideButton ? undefined : (
                    <Button
                        onClick={() => {
                            setCreateSlidePanelOpen(true);
                        }}
                    >
                        Add Asset
                    </Button>
                )
            }
            includeOuterRings
        />
    );
};

export default NoAssetsEmptyState;
