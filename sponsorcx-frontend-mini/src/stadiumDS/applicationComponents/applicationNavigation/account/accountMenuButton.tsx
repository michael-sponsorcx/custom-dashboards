import { CXIconProps } from '@/assets/icons/IconProps';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import 'styled-components/macro';

interface AccountMenuButtonProps {
    icon: ({ color, size }: CXIconProps) => React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

export const AccountMenuButton = ({
    icon,
    label,
    onClick,
    disabled,
}: AccountMenuButtonProps) => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 8px;
                padding: 8px;
                width: 100%;
                cursor: ${disabled ? 'not-allowed' : 'pointer'};
            `}
            onClick={disabled ? undefined : onClick}
        >
            {icon({ color: primaryColors.Gray[500], size: '20' })}
            <div
                css={`
                    font-weight: 600;
                    color: ${primaryColors.Gray[700]};
                `}
            >
                {label}
            </div>
        </div>
    );
};
