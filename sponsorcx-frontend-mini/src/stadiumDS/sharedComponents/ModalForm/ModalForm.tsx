import X from '@/stadiumDS/foundations/icons/General/X';
import * as S from './ModalForm.styles';
import colors from '@/stadiumDS/foundations/colors';
import { Button, MantineStyleProp } from '@mantine/core';
import buttonClasses from './Modules/Buttons.module.css';
import { CSSProperties } from 'react';

interface ModalFormHeaderProps {
    title?: string;
    description?: React.ReactNode;
    extraHeaderContent?: React.ReactNode;
    headerUnderline?: boolean;
    preHeaderContent?: React.ReactNode;
}

interface ModalFormButtonProps {
    text?: string;
    disabled?: boolean;
    loading?: boolean;
    variant?: string;
    styles?: MantineStyleProp;
    onClick?: (e: React.MouseEvent) => void;
}

export interface ModalFormProps {
    header?: ModalFormHeaderProps;
    includeCloseButton?: boolean;
    children?: React.ReactNode;
    includeButtons?: boolean;
    buttonContainerStyles?: MantineStyleProp;
    primaryButton?: ModalFormButtonProps;
    secondaryButton?: ModalFormButtonProps;
    onClose?: () => void;
    padding?: string;
    stopPropagation?: boolean;
    loadingMutation?: boolean;
}

export const ModalForm = ({
    header = {},
    includeCloseButton = true,
    children,
    includeButtons = true,
    buttonContainerStyles,
    primaryButton = {},
    secondaryButton = {},
    onClose,
    padding,
    stopPropagation = false,
    loadingMutation = false,
}: ModalFormProps) => {
    const {
        title,
        description,
        extraHeaderContent,
        headerUnderline,
        preHeaderContent,
    } = header;
    const {
        text: primaryButtonText = 'Save',
        disabled: primaryButtonDisabled = false,
        loading: primaryButtonLoading = false,
        variant: primaryButtonVariant = 'primary',
        styles: primaryButtonStyles,
        onClick: onPrimaryButtonClick,
    } = primaryButton;
    const {
        text: secondaryButtonText = 'Cancel',
        disabled: secondaryButtonDisabled = false,
        loading: secondaryButtonLoading = false,
        variant: secondaryButtonVariant = 'outline',
        styles: secondaryButtonStyles,
        onClick: onSecondaryButtonClick = onClose,
    } = secondaryButton;

    return (
        <S.Container $padding={padding}>
            {includeCloseButton && (
                <S.CloseIconContainer
                    onClick={(e) => {
                        if (stopPropagation) {
                            e.stopPropagation();
                        }
                        onClose?.();
                    }}
                >
                    <X size="24" color={colors.Gray[400]} />
                </S.CloseIconContainer>
            )}
            <S.ContentContainer>
                {preHeaderContent}
                {(title || description) && (
                    <S.HeaderContainer>
                        {title && (
                            <S.Title $avoidCloseButton={includeCloseButton}>
                                {title}
                            </S.Title>
                        )}
                        {description && (
                            <S.Description>{description}</S.Description>
                        )}
                    </S.HeaderContainer>
                )}
                {extraHeaderContent}
                {headerUnderline && <S.Underline />}
                {children && <S.BodyContainer>{children}</S.BodyContainer>}
            </S.ContentContainer>
            {includeButtons && (
                <S.ButtonsContainer
                    style={buttonContainerStyles as CSSProperties}
                >
                    <Button
                        variant={secondaryButtonVariant}
                        disabled={secondaryButtonDisabled || loadingMutation}
                        loading={secondaryButtonLoading}
                        onClick={onSecondaryButtonClick}
                        classNames={buttonClasses}
                        style={secondaryButtonStyles}
                    >
                        {secondaryButtonText}
                    </Button>
                    <Button
                        variant={primaryButtonVariant}
                        disabled={primaryButtonDisabled || loadingMutation}
                        loading={primaryButtonLoading || loadingMutation}
                        onClick={onPrimaryButtonClick}
                        classNames={buttonClasses}
                        style={primaryButtonStyles}
                    >
                        {primaryButtonText}
                    </Button>
                </S.ButtonsContainer>
            )}
        </S.Container>
    );
};
