import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { Link } from 'react-router-dom';
import 'styled-components/macro';

export interface HeaderTab {
    label: string;
    to: string;
    active: boolean;
}

export const Tab = ({ tab }: { tab: HeaderTab }) => {
    return (
        <Link
            data-testid={`main-header-tab-${tab.label}${
                tab.active ? '-active' : ''
            }`}
            to={tab.to}
            css={`
                display: flex;
                padding: 0px 4px 10px 4px;
                border-bottom: 2px solid
                    ${tab.active ? primaryColors.Brand[400] : 'transparent'};
                font-weight: 600;
                color: ${tab.active
                    ? primaryColors.Brand[400]
                    : primaryColors.Gray[500]};

                &:hover {
                    color: ${tab.active
                        ? primaryColors.Brand[400]
                        : primaryColors.Gray[500]};
                }
            `}
        >
            {tab.label}
        </Link>
    );
};
