import { colors } from '@/utils/colors';
import { Button } from '@mantine/core';
import { ReactNode } from 'react';
import 'styled-components/macro';
import OuterRings from './OuterRings';

interface GenericSlideOutEmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    includeOuterRings?: boolean;
    hideAddButton?: boolean;
}

const GenericSlideOutEmptyState = ({
    icon,
    title,
    description,
    buttonText,
    onButtonClick,
    includeOuterRings = true,
    hideAddButton = false,
}: GenericSlideOutEmptyStateProps) => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
                justify-content: center;
                height: 100%;
            `}
        >
            <div
                css={`
                    display: flex;
                    padding: 12px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    border: 1px solid var(--Colors-Gray-200, #e9eaeb);
                    box-shadow: 0px 0px 0px 1px rgba(10, 13, 18, 0.18) inset,
                        0px -2px 0px 0px rgba(10, 13, 18, 0.05) inset,
                        0px 1px 2px 0px rgba(16, 24, 40, 0.05);
                    position: relative;
                `}
            >
                {icon}
                {includeOuterRings && <OuterRings />}
            </div>
            <div
                css={`
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 352px;
                    max-width: 100%;
                    align-items: center;
                    z-index: 2;
                    margin-bottom: 48px;
                `}
            >
                <div
                    css={`
                        font-size: 20px;
                        font-weight: 700;
                        color: ${colors.Gray1};
                    `}
                >
                    {title}
                </div>
                <div
                    css={`
                        font-size: 14px;
                        color: ${colors.Gray2};
                        text-align: center;
                    `}
                >
                    {description}
                </div>
                {!hideAddButton && (
                    <Button onClick={onButtonClick}>{buttonText}</Button>
                )}
            </div>
        </div>
    );
};

export default GenericSlideOutEmptyState;
