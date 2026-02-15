import GenericListEmptyState from './GenericListEmptyState';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import colors from '@/stadiumDS/foundations/colors';
import { Button } from '@mantine/core';
import { useLexicon } from '@/hooks/useLexicon';

const NoPropertiesEmptyState = ({
    canEditBrandProperties,
    setCreateSlidePanelOpen,
}: {
    canEditBrandProperties: boolean;
    setCreateSlidePanelOpen: (open: boolean) => void;
}) => {
    const lexicon = useLexicon();
    return (
        <GenericListEmptyState
            icon={<Building variant="6" color={colors.Gray[700]} size="24" />}
            title={`No ${lexicon.b_properties} Found`}
            description={`Add a new ${lexicon.b_property.toLowerCase()} or import an existing one`}
            button={
                canEditBrandProperties ? (
                    <Button
                        onClick={() => {
                            setCreateSlidePanelOpen(true);
                        }}
                    >
                        Create {lexicon.b_property}
                    </Button>
                ) : null
            }
            includeOuterRings
        />
    );
};

export default NoPropertiesEmptyState;
