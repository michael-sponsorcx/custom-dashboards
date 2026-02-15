import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import 'styled-components/macro';

export const SettingsCardHeader = ({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}): JSX.Element => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: column;
                gap: 2px;
                width: 100%;
                padding-bottom: 20px;
                border-bottom: 1px solid ${primaryColors.Gray[200]};
            `}
        >
            <div
                css={`
                    color: ${primaryColors.Gray[900]};
                    font-size: 18px;
                    font-weight: 600;
                    line-height: 28px;
                `}
                data-testid="settings-card-header-title"
            >
                {title}
            </div>
            <div
                css={`
                    color: ${primaryColors.Gray[600]};
                    font-size: 14px;
                    line-height: 20px;
                `}
            >
                {subtitle}
            </div>
        </div>
    );
};
