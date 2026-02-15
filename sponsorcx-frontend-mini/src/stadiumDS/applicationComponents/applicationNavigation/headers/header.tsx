import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import 'styled-components/macro';
import { HeaderButtons } from './headerButtons';
import { HeaderTab } from './tabs/tab';
import { TabsList } from './tabs/tabsList';

interface HeaderProps {
    children: React.ReactNode;
    tabs?: HeaderTab[];
}

export const Header = ({ children, tabs }: HeaderProps) => {
    return (
        <div
            css={`
                display: flex;
                flex-direction: column;
                width: 100%;
                padding: 16px 24px ${tabs ? 0 : 16}px 24px;
                border-bottom: 1px solid ${primaryColors.Gray[200]};
                box-sizing: border-box;
                gap: 10px;
            `}
        >
            <div
                css={`
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                `}
            >
                {children}
                <HeaderButtons />
            </div>
            {tabs && <TabsList tabs={tabs} />}
        </div>
    );
};
