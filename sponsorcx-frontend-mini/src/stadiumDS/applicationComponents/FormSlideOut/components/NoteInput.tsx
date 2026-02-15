import colors from '@/stadiumDS/foundations/colors';
import { AutoSizeTextInput } from '@/stadiumDS/sharedComponents/AutoSizeTextInput/AutoSizeTextInput';
import { StadiumRequiredIndicator } from '@/stadiumDS/sharedComponents/RequiredIndicator/StadiumRequiredIndicator';

export interface NoteInputProps {
    value: string;
    placeholder: string;
    onUpdate: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    highlightRequiredFields?: boolean;
}

export const NoteInput = ({
    value,
    placeholder,
    onUpdate,
    disabled,
    required = false,
    highlightRequiredFields = false,
}: NoteInputProps) => {
    const shouldHighlight =
        highlightRequiredFields && required && !value.length;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {required && (
                <span style={{ padding: '0px 4px 8px 0px' }}>
                    <StadiumRequiredIndicator />
                </span>
            )}

            <AutoSizeTextInput
                defaultValue={value}
                placeholder={placeholder}
                onUpdate={onUpdate}
                styles={{
                    input: {
                        border: 'none',
                        borderBottom: shouldHighlight
                            ? `1px solid ${colors.Error[500]}`
                            : 'none',
                        color: colors.Gray[600],
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '18px',
                        borderRadius: '0px',
                    },
                }}
                allowNewLines
                disabled={disabled}
                maxRows={undefined}
            />
        </div>
    );
};
