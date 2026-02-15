import { formatDate } from '@/utils/helpers';
import { UploadsCellProps } from './UploadsCells';

export const UploadsUpdatedAtCell = ({ info }: UploadsCellProps) => {
    const updated_at = info.getValue();
    return formatDate(updated_at);
};
