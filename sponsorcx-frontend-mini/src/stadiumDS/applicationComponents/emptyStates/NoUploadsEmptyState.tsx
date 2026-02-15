import Upload from '@/stadiumDS/foundations/icons/General/Upload';
import GenericListEmptyState from './GenericListEmptyState';
import colors from '@/stadiumDS/foundations/colors';
import { Button } from '@mantine/core';

interface NoUploadsEmptyStateProps {
    handlePrimaryBtnClick: () => void;
    hidePrimaryBtn?: boolean;
}

export const NoUploadsEmptyState = ({
    handlePrimaryBtnClick,
    hidePrimaryBtn,
}: NoUploadsEmptyStateProps) => {
    return (
        <GenericListEmptyState
            icon={<Upload color={colors.Gray[700]} size="24" variant="1" />}
            title="No uploads"
            description="Upload files to get started"
            button={
                hidePrimaryBtn ? undefined : (
                    <Button onClick={handlePrimaryBtnClick}>Upload</Button>
                )
            }
            includeOuterRings
        />
    );
};
