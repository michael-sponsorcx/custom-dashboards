import 'styled-components/macro';
import { HeaderTab, Tab } from './tab';

export const TabsList = ({ tabs }: { tabs: HeaderTab[] }) => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: row;
                padding-top: 16px;
                gap: 12px;
            `}
        >
            {tabs.map((tab) => (
                <Tab key={`tab-${tab.to}`} tab={tab} />
            ))}
        </div>
    );
};
