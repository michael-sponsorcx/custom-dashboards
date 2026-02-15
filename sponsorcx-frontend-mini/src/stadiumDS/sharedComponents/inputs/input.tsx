import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import InfoCircle from '@/stadiumDS/foundations/icons/General/InfoCircle';
import { Input } from '@mantine/core';
import 'styled-components/macro';

export interface StadiumInputProps {
    label?: string;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    leftContent?: React.ReactNode;
    padding?: string;
    height?: string;
    labelColor?: string;
    fontSize?: number;
    type?: string;
    width?: string;
    error?: React.ReactNode;
    autoFocus?: boolean;
    textAlign?: 'left' | 'right' | 'center';
}

export const StadiumInput = ({
    label,
    required = false,
    disabled = false,
    name,
    placeholder = '',
    value = '',
    onChange = () => {},
    onBlur = () => {},
    leftContent,
    padding = '8px 28px 8px 12px',
    height = '40px',
    width = '100%',
    labelColor,
    fontSize = 16,
    type = 'text',
    error,
    autoFocus,
    textAlign = 'left',
}: StadiumInputProps): JSX.Element => {
    return (
        <Input.Wrapper
            styles={{
                label: {
                    marginBottom: 6,
                    '--input-label-size': 14,
                    color: labelColor || primaryColors.Gray[700],
                },
                required: {
                    color: primaryColors.Brand[400],
                },
                root: {
                    width: width,
                },
            }}
            error={error}
        >
            {label && <Input.Label required={required}>{label}</Input.Label>}
            <Input
                placeholder={placeholder}
                name={name}
                styles={{
                    input: {
                        padding: padding,
                        borderRadius: 8,
                        border: `1px solid ${
                            error
                                ? primaryColors.Error[500]
                                : primaryColors.Gray[300]
                        }`,
                        boxShadow: '0px 1px 2px 0px rgba(10, 13, 18, 0.05)',
                        color: primaryColors.Gray[700],
                        fontSize,
                        fontWeight: 400,
                        fontFamily: 'Inter',
                        height: height,
                        minHeight: height,
                        textAlign: textAlign,
                        '&:focus': {
                            borderColor: error
                                ? primaryColors.Error[500]
                                : primaryColors.Gray[400],
                            outline: 'none',
                        },
                    },
                }}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                leftSection={leftContent}
                type={type}
                aria-invalid={!!error}
                autoFocus={autoFocus}
                rightSection={
                    error ? (
                        <InfoCircle color={primaryColors.Error[500]} />
                    ) : undefined
                }
            />
        </Input.Wrapper>
    );
};
