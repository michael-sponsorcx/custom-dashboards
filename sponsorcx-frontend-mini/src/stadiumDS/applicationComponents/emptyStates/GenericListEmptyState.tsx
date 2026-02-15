import { ReactNode } from 'react';
import OuterRings from './OuterRings';
import { colors } from '@/utils/colors';
import 'styled-components/macro';

interface GenericPropertiesListEmptyStateProps {
    icon: ReactNode;
    includeOuterRings?: boolean;
    title: string;
    description: string;
    button?: ReactNode;
    marginTop?: string;
}

const GenericListEmptyState = ({
    icon,
    includeOuterRings,
    title,
    description,
    button,
    marginTop = '25vh',
}: GenericPropertiesListEmptyStateProps) => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: column;
                gap: 16px;
                width: 100%;
                margin-top: ${marginTop};
                min-height: fit-content;
                align-items: center;
                justify-content: center;
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
                    gap: 8px;
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
                {button}
            </div>
        </div>
    );
};

export default GenericListEmptyState;
