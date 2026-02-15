import { MainPanelSection } from './MainPanelSection';
import { Files, FilesProps } from './Files/Files';
import { NoteInput, NoteInputProps } from './NoteInput';

type NoteAndFilesSectionProps = {
    title?: string;
    files: FilesProps;
    descriptionRequired?: boolean;
    uploadRequired?: boolean;
    highlightRequiredFields?: boolean;
} & NoteInputProps;

export const NoteAndFilesSection = ({
    title,
    files,
    descriptionRequired = false,
    uploadRequired = false,
    highlightRequiredFields = false,
    ...noteInputProps
}: NoteAndFilesSectionProps) => {
    return (
        <MainPanelSection title={title} minHeight="150px">
            <NoteInput
                {...noteInputProps}
                required={descriptionRequired}
                highlightRequiredFields={highlightRequiredFields}
            />
            <Files
                {...files}
                uploadRequired={uploadRequired}
                highlightRequiredFields={highlightRequiredFields}
            />
        </MainPanelSection>
    );
};
