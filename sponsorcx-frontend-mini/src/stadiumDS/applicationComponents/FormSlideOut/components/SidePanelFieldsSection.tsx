import { SidePanelField } from './SidePanelFields/SidePanelField';
import { SidePanelFieldProps } from './SidePanelFields/SidePanelFields.types';
import { SidePanelSection } from './SidePanelSection';
import { SidePanelSectionHeaderProps } from './SidePanelSectionHeader';

interface SidePanelFieldsSectionProps {
    header?: SidePanelSectionHeaderProps;
    secondaryHeader?: SidePanelSectionHeaderProps;
    fields: SidePanelFieldProps[];
}

export const SidePanelFieldsSection = ({
    header,
    secondaryHeader,
    fields,
}: SidePanelFieldsSectionProps) => {
    return (
        <SidePanelSection header={header} secondaryHeader={secondaryHeader}>
            {fields.map((fieldProps, index) => (
                <SidePanelField
                    key={`${fieldProps.label}-${index}`}
                    {...fieldProps}
                />
            ))}
        </SidePanelSection>
    );
};
