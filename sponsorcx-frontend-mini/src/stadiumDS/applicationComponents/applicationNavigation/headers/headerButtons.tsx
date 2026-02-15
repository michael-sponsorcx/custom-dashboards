import { RecentActivityMenu } from '../RecentActivity/RecentActivityMenu';
import { useBrandV1Enabled } from '@/hooks/useBrandV1Enabled';
import { BrandPropertySwitcher } from '@/components/Elements/BrandPropertySwitcher';
import { Recents } from '@/components/Elements/Recents/recents';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import Clock from '@/stadiumDS/foundations/icons/Time/Clock';
import { Tooltip } from '@mantine/core';
import 'styled-components/macro';

export const HeaderButtons = () => {
    const brandV1Enabled = useBrandV1Enabled();

    return (
        <div
            css={`
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 15px;
            `}
        >
            {/* TODO: Implement notifications button */}
            {/* <div>
                <Bell color={primaryColors.Gray[600]} size="24" variant="1" />
            </div> */}
            <BrandPropertySwitcher />
            {brandV1Enabled ? (
                <RecentActivityMenu />
            ) : (
                <Recents
                    customTrigger={(onClick) => (
                        <Tooltip label="Recent Activity">
                            <div
                                css={`
                                    height: 24px;
                                    cursor: pointer;
                                `}
                                onClick={onClick}
                            >
                                <Clock
                                    color={primaryColors.Gray[600]}
                                    size="20"
                                    variant="rewind"
                                />
                            </div>
                        </Tooltip>
                    )}
                />
            )}
        </div>
    );
};
