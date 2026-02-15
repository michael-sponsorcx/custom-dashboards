import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { HeaderTab } from './tab';
import { TabsList } from './tabsList';
import 'styled-components/macro';

export const TabHeader = ({ tabs }: { tabs: HeaderTab[] }) => {
    return (
        <div
            css={`
                display: flex;
                width: 100%;
                border-bottom: 1px solid ${primaryColors.Gray[200]};
                box-sizing: border-box;
            `}
        >
            <TabsList tabs={tabs} />
        </div>
    );
};
