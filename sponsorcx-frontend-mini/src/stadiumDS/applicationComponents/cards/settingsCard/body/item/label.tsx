import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import 'styled-components/macro';

export const SettingsCardBodyItemLabel = ({
    label,
}: {
    label: string;
}): JSX.Element => {
    return (
        <span
            css={`
                color: ${primaryColors.Gray[700]};
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                display: inline-block;
            `}
        >
            {label}&nbsp;
            <span
                css={`
                    color: ${primaryColors.Brand[400]};
                `}
            >
                *
            </span>
        </span>
    );
};
