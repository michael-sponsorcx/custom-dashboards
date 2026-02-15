import { StadiumConfirmActionPopup } from '@/stadiumDS/sharedComponents/ConfirmActionPopup/StadiumConfirmActionPopup';
import { UploadsCellProps } from './UploadsCells';
import { ActionIcon } from '@mantine/core';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import colors from '@/stadiumDS/foundations/colors';
import { useMutation } from '@apollo/client';
import { deleteUploadsMutation } from '@/gql/uploadGql';
import useStore from '@/state';
import { refetchAgreementHistoryQueries } from '@/hooks/useAgreementHistory';

export const UploadsActionsCell = ({
    info,
    refetchUploads,
}: UploadsCellProps & { refetchUploads: () => void }) => {
    const organizationId = useStore((state) => state.organization?.id);

    const [deleteUploads] = useMutation(deleteUploadsMutation, {
        onCompleted: () => {
            refetchUploads();
        },
        refetchQueries: refetchAgreementHistoryQueries,
    });

    const handleDelete = async (ids: string[]) => {
        await deleteUploads({
            variables: {
                ids,
                organization_id: organizationId,
            },
        });
    };

    return (
        <StadiumConfirmActionPopup
            title="Delete Upload"
            description="Are you sure you want to delete this upload?"
            onConfirm={() => handleDelete([info.row.original.id])}
            getTrigger={(setOpen) => (
                <ActionIcon
                    style={{
                        width: 16,
                        height: 16,
                        minWidth: 16,
                        minHeight: 16,
                    }}
                    onClick={() => setOpen(true)}
                >
                    <Trash variant="3" color={colors.Gray[400]} size="16" />
                </ActionIcon>
            )}
            withinPortal
        />
    );
};
