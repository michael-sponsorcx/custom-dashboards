import { MainPanelSection } from './MainPanelSection';
import { NoteInput, NoteInputProps } from './NoteInput';

type NoteSectionProps = {
    title?: string;
    minHeight?: string;
} & NoteInputProps;

export const NoteSection = ({
    title,
    minHeight = '150px',
    ...noteInputProps
}: NoteSectionProps) => {
    return (
        <MainPanelSection title={title} minHeight={minHeight}>
            <NoteInput {...noteInputProps} />
        </MainPanelSection>
    );
};
