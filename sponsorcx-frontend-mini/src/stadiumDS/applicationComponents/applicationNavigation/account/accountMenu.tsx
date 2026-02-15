import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import LogOut from '@/stadiumDS/foundations/icons/General/LogOut';
import User from '@/stadiumDS/foundations/icons/Users/User';
import 'styled-components/macro';
import { AccountMenuButton } from './accountMenuButton';
import { useAuthStore } from '@/stores/authStore';
import { useHistory, useLocation } from 'react-router-dom';
import OrganizationSwitcher from '../OrganizationSwitcher';

export const AccountMenu = ({
    width,
    isOpen,
    setIsOpen,
}: {
    width: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) => {
    const logout = useAuthStore((state) => state.appLogout);
    const history = useHistory();
    const location = useLocation();
    const isRelay = location.pathname.startsWith('/relay');

    return (
        <div
            css={`
                position: absolute;
                top: -111px;
                left: 0;
                z-index: 9999;
                display: ${isOpen ? 'flex' : 'none'};
                flex-direction: column;
                width: ${width}px;
                min-width: 164px;
                border-radius: 12px;
                border: 1px solid ${primaryColors.Gray[200]};
                background: ${primaryColors.Gray[50]};
                box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08),
                    0px 4px 6px -2px rgba(10, 13, 18, 0.03),
                    0px 2px 2px -1px rgba(10, 13, 18, 0.04);
            `}
        >
            <div
                css={`
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding: 6px;
                    border-radius: 12px 12px 16px 16px;
                    border-bottom: 1px solid ${primaryColors.Gray[200]};
                    background: ${primaryColors.Base.White};
                `}
            >
                <AccountMenuButton
                    icon={({ color, size }) => (
                        <User color={color} size={size} variant={'1'} />
                    )}
                    label="View profile"
                    onClick={() => {
                        setIsOpen(false);
                        history.push(
                            isRelay
                                ? `/relay/settings/profile`
                                : `/settings/profile`
                        );
                    }}
                />
            </div>
            <div
                css={`
                    display: flex;
                    flex-direction: column;
                    padding: 4px 6px;
                `}
            >
                <OrganizationSwitcher parentIsOpen={isOpen} />
            </div>
            <div
                css={`
                    display: flex;
                    flex-direction: column;
                    padding: 4px 6px;
                `}
            >
                <AccountMenuButton
                    icon={({ color, size }) => (
                        <LogOut color={color} size={size} variant={'1'} />
                    )}
                    label="Sign out"
                    onClick={logout}
                />
            </div>
        </div>
    );
};
