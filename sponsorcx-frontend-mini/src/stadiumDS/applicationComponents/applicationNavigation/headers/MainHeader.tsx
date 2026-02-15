import 'styled-components/macro';
import { Header } from './header';
import { HeaderTab } from './tabs/tab';
import Breadcrumb from '../../breadcrumbs/Breadcrumb';

interface MainHeaderProps {
    title: string;
    tabs?: HeaderTab[];
    children?: React.ReactNode;
    breadcrumbs?: { title: string; to: string }[];
}

export const MainHeader = ({
    title,
    tabs,
    children,
    breadcrumbs,
}: MainHeaderProps) => {
    return (
        <Header tabs={tabs}>
            <div
                css={`
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                `}
            >
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div>
                        <Breadcrumb breadCrumbList={breadcrumbs} />
                    </div>
                )}
                <div
                    css={`
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 28px;
                        display: flex;
                        align-items: center;
                    `}
                >
                    <div data-testid="main-header-title">{title}</div>
                    <div>{children}</div>
                </div>
            </div>
        </Header>
    );
};
