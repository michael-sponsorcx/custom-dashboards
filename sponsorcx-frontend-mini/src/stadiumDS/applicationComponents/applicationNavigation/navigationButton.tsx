import { CXIconProps } from '@/assets/icons/IconProps';
import { useTruncation } from '@/hooks/useTruncation';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import { Tooltip } from '@mantine/core';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { SemanticICONS } from 'semantic-ui-react';
import 'styled-components/macro';

interface NavigationButtonProps {
    icon?: SemanticICONS | FC<CXIconProps>;
    label: string;
    to?: string;
    isActive: boolean;
    simplifiedView: boolean;
    notificationCount?: number;
    isSubRoute?: boolean;
    hasSubRoutes?: boolean;
    isExpanded?: boolean;
    setIsExpanded?: (isExpanded: boolean) => void;
    width: number;
}

const NavigationButton = ({
    icon,
    label,
    to,
    isActive,
    simplifiedView,
    notificationCount = 0,
    isSubRoute = false,
    hasSubRoutes = false,
    isExpanded = false,
    setIsExpanded = () => {},
    width,
}: NavigationButtonProps) => {
    const truncated = useTruncation({
        dependencies: [simplifiedView, label, width],
        elementId: `navigation-button-label-${to ?? ''}`,
    });

    return (
        <NavigationButtonWrapper
            to={hasSubRoutes ? undefined : to}
            simplifiedView={simplifiedView}
            isActive={hasSubRoutes ? false : isActive}
            onClick={() => setIsExpanded(hasSubRoutes ? !isExpanded : false)}
        >
            <Tooltip
                label={label}
                disabled={!truncated && !simplifiedView}
                withinPortal
            >
                <div
                    css={`
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: 8px;
                        ${simplifiedView ? '' : 'flex: 1;'}
                        min-width: 0;
                        overflow: hidden;
                    `}
                >
                    {icon && (
                        <div
                            css={`
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-shrink: 0;
                                width: 20px;
                                height: 20px;
                                position: relative;
                            `}
                        >
                            {notificationCount > 0 && simplifiedView && (
                                <div
                                    css={`
                                        position: absolute;
                                        top: ${label === 'Activities'
                                            ? 3
                                            : 1}px;
                                        right: 1px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        width: 6px;
                                        height: 6px;
                                        border-radius: 50%;
                                        background-color: ${primaryColors
                                            .Gray[50]};
                                    `}
                                >
                                    <div
                                        css={`
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            width: 4px;
                                            height: 4px;
                                            border-radius: 50%;
                                            background-color: ${primaryColors
                                                .Brand[400]};
                                        `}
                                    />
                                </div>
                            )}
                            {typeof icon === 'function'
                                ? icon({
                                      color: primaryColors.Gray[
                                          isActive && simplifiedView ? 700 : 500
                                      ],
                                      size: '16',
                                  })
                                : icon}
                        </div>
                    )}
                    {!simplifiedView && (
                        <div
                            id={`navigation-button-label-${to ?? ''}`}
                            css={`
                                flex: 1;
                                min-width: 0;
                                color: ${primaryColors.Gray[
                                    isActive ? 800 : 700
                                ]};
                                font-weight: ${isActive ? 600 : 400};
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                ${isSubRoute ? 'padding-left: 32px;' : ''}
                            `}
                        >
                            {label}
                        </div>
                    )}
                </div>
            </Tooltip>
            {hasSubRoutes && !simplifiedView && (
                <Chevron
                    color={primaryColors.Gray[isActive ? 800 : 700]}
                    size="16"
                    variant={isExpanded ? 'up' : 'down'}
                />
            )}
            {notificationCount > 0 && !simplifiedView && (
                <div
                    css={`
                        display: flex;
                        padding: 2px 8px;
                        align-items: center;
                        border-radius: 16px;
                        border: 1px solid ${primaryColors.Gray[200]};
                        background: ${primaryColors.Gray[50]};
                        color: var(--Gray-700, #414651);
                        text-align: center;
                        font-size: 12px;
                        font-weight: 500;
                        line-height: 16px;
                        flex-shrink: 0;
                        margin: -1px 0px;
                    `}
                >
                    {notificationCount}
                </div>
            )}
        </NavigationButtonWrapper>
    );
};

const NavigationButtonWrapper = ({
    children,
    to,
    simplifiedView,
    isActive,
    onClick,
}: {
    children: React.ReactNode;
    to?: string;
    simplifiedView: boolean;
    isActive: boolean;
    onClick?: () => void;
}) => {
    const sharedStyles = `
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 100%;
        min-width: 36px;
        justify-content: ${simplifiedView ? 'center' : 'flex-start'};
        align-items: center;
        padding: 8px ${simplifiedView ? 0 : 12}px;
        border-radius: 6px;
        background-color: ${isActive ? primaryColors.Gray[200] : 'transparent'};
        gap: 8px;
        margin: 2px 0px;
        overflow: hidden;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            background-color: ${
                isActive ? primaryColors.Gray[200] : primaryColors.Gray[100]
            };
        }
    `;

    if (to) {
        return (
            <Link to={to} css={sharedStyles}>
                {children}
            </Link>
        );
    }

    return (
        <div css={sharedStyles} onClick={onClick}>
            {children}
        </div>
    );
};

export default NavigationButton;
