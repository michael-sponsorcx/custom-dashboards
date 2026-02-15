import { BulkEditField } from '@/components/DataTable/BulkEditModal/BulkEditModal.types';
import { useMutation } from '@apollo/client';
import { stadiumToast } from '../../Toasts/StadiumToast.helpers';
import TextInput from '@/stadiumDS/foundations/icons/Editor/TextInput';
import colors from '@/stadiumDS/foundations/colors';
import { bulkUpdateUploads } from '@/gql/uploadGql';

export const useUploadsBulkUpdateFields = ({
    onBulkUpdateComplete,
    onBulkUpdateError,
    queryName,
}: {
    onBulkUpdateComplete?: () => void;
    onBulkUpdateError?: () => void;
    queryName: string;
}) => {
    const bulkUpdateFields: BulkEditField[] = [
        {
            key: 'notes',
            label: 'Notes',
            type: 'text' as const,
            icon: <TextInput color={colors.Gray[500]} size="16" />,
        },
    ];

    const [bulkUpdateGql] = useMutation(bulkUpdateUploads, {
        refetchQueries: [queryName],
        onError: () => {
            stadiumToast.error('Error bulk updating selected uploads...');
            onBulkUpdateError?.();
        },
        onCompleted: () => {
            onBulkUpdateComplete?.();
        },
    });

    return {
        bulkUpdateFields,
        bulkUpdateGql,
    };
};
