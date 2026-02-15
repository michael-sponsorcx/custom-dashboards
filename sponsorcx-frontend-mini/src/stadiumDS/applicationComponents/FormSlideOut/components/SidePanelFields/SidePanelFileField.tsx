import { useState } from 'react';
import {
    FileFieldProps,
    sidePanelFieldPlaceholderColor,
    sidePanelLabelIconSize,
} from './SidePanelFields.types';
import { UnstyledButton } from '@mantine/core';
import { SidePanelFieldLabel } from './SidePanelFieldLabel';
import Upload from '@/stadiumDS/foundations/icons/General/Upload';
import useStore from '@/state';
import { SidePanelFieldValue } from './SidePanelFieldValue';
import Paperclip from '@/stadiumDS/foundations/icons/General/Paperclip';
import colors from '@/stadiumDS/foundations/colors';
import triggerButtonClasses from './SidePanelTriggerButton.module.css';
import { CustomFieldFileModal } from '@/modals/CustomFieldFileModal';

type SidePanelFileFieldProps = Omit<FileFieldProps, 'type'> & {
    prefixKey?: string;
};

export const SidePanelFileField = ({
    value,
    onChange,
    label,
    disabled,
    required,
    highlightRequiredFields,
    prefixKey,
}: SidePanelFileFieldProps) => {
    const uploadLabel = `Upload ${label}`;
    const [modalOpen, setModalOpen] = useState(false);
    const organization = useStore((store) => store.organization);

    const handleConfirm = (fileS3Key: string | null) => {
        onChange(fileS3Key);
    };

    if (disabled && !value) {
        return (
            <SidePanelFieldLabel
                label={label}
                icon={
                    <Upload
                        color={sidePanelFieldPlaceholderColor}
                        size={String(sidePanelLabelIconSize)}
                        variant="1"
                    />
                }
            />
        );
    }

    return (
        <>
            <UnstyledButton
                onClick={() => setModalOpen(true)}
                className={triggerButtonClasses.triggerButton}
            >
                {value ? (
                    <SidePanelFieldValue
                        value={value.split('/').pop() || value}
                        icon={
                            <Paperclip
                                color={colors.Gray[700]}
                                size={String(sidePanelLabelIconSize)}
                            />
                        }
                        tooltip={disabled ? label : uploadLabel}
                    />
                ) : (
                    <SidePanelFieldLabel
                        label={uploadLabel}
                        required={required}
                        icon={
                            <Upload
                                color={sidePanelFieldPlaceholderColor}
                                size={String(sidePanelLabelIconSize)}
                                variant="1"
                            />
                        }
                        highlight={
                            required && !value && highlightRequiredFields
                        }
                    />
                )}
            </UnstyledButton>
            <CustomFieldFileModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                organizationId={organization?.id || ''}
                existingFile={value}
                title={label}
                disabled={disabled}
                prefixKey={prefixKey}
            />
        </>
    );
};
