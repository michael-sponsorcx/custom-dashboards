import { EditInPlaceInput } from '@/stadiumDS/sharedComponents/inputs/editInPlaceInput';
import { UploadsCellProps } from './UploadsCells';

type UploadsNotesCellProps = UploadsCellProps & {
    handleUpdateUpload: (
        id: string,
        updateFields: { display_name?: string; notes?: string }
    ) => Promise<void>;
};

export const UploadsNotesCell = ({
    info,
    handleUpdateUpload,
}: UploadsNotesCellProps) => {
    const notes = info.getValue();
    return (
        <EditInPlaceInput
            value={notes}
            onChange={(value) => {
                handleUpdateUpload(info.row.original.id, { notes: value });
            }}
            placeholder="--"
        />
    );
};
