import { ReadOnlyFieldProps } from './SidePanelFields.types';
import { SidePanelFieldValue } from './SidePanelFieldValue';

export const SidePanelReadOnlyField = ({
    value,
    icon,
    onClick,
}: Omit<ReadOnlyFieldProps, 'type'>) => {
    return <SidePanelFieldValue value={value} icon={icon} onClick={onClick} />;
};
