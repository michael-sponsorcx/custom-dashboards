import useStore from '@/state';
import cxBlue from '@/assets/images/cx-blue.svg';
import sponsorcxBlackAndBlue from '@/assets/images/sponsorcx-black-and-blue.svg';
import NavigationButton from './navigationButton';
import { RouteType } from '@/pages/appRoutes';
import 'styled-components/macro';
import { AccountButton } from './account/accountButton';
import Message from '@/stadiumDS/foundations/icons/Communication/Message';
import { useState, Fragment, useEffect } from 'react';
import { Resizable, ResizeCallback } from 're-resizable';
import * as Styled from '@/stadiumDS/sharedComponents/SlideOut/SlideOut.styles';
import colors from '@/stadiumDS/foundations/colors';
import { NavigationLogo } from './NavigationLogo';
import { NFLAdminSwitch } from '@/pages/teamPortal/components/NFLAdminSwitch';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import Building from '@/stadiumDS/foundations/icons/General/Building';

const defaultWidth = 230;
const maxWidth = 365;
const minWidth = 64;
const collapsedThresholdWidth = 145;
const NAV_WIDTH_KEY = 'navigation-width';
const NAV_WIDTH_EXPANDED_KEY = 'navigation-width-expanded';

interface ApplicationNavigationProps {
    routeExpanded: boolean;
    setRouteExpanded: (routeExpanded: boolean) => void;
    routes: RouteType[];
    active: string;
    secondaryRoute: string;
    handleSupportClick: () => void;
    // Optional props for NFL Admin switch (relay context)
    showNFLAdminSwitch?: boolean;
    isNFLAdmin?: boolean;
    onNFLAdminToggle?: () => void;
    // Optional prop to show relay button (for czar users in main app)
    showRelayButton?: boolean;
}

const ApplicationNavigation = ({
    routeExpanded,
    setRouteExpanded,
    routes,
    active,
    secondaryRoute,
    handleSupportClick,
    showNFLAdminSwitch = false,
    isNFLAdmin = false,
    onNFLAdminToggle,
    showRelayButton = false,
}: ApplicationNavigationProps) => {
    const [width, setWidth] = useState(defaultWidth);
    const organization = useStore((state) => state.organization);
    const sidebarCollapsed = useStore((state) => state.sidebarCollapsed);
    const setSidebarCollapsed = useStore((state) => state.setSidebarCollapsed);

    const simplifiedView = width < 145;

    const { unreadCount: inboxNotificationCount } = useUnreadMessages();
    const activityNotificationCount = 0;

    const getNotificationCount = (route: string) => {
        switch (route) {
            case 'inbox':
                return inboxNotificationCount;
            case 'activities':
                return activityNotificationCount;
            default:
                return 0;
        }
    };

    const clampWidth = (value: number) =>
        Math.min(maxWidth, Math.max(minWidth, value));

    const safeStorageGetItem = (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    };

    const safeStorageSetItem = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            // ignore storage failures (blocked / quota / etc.)
        }
    };

    const parseWidthFromRef = (ref: HTMLDivElement) => {
        const raw = ref?.style?.width;
        if (!raw) {
            return null;
        }
        const parsed = Number(raw.replace('px', ''));
        if (Number.isNaN(parsed)) {
            return null;
        }
        return clampWidth(parsed);
    };

    // Visual updates only while dragging (no persistence).
    const handleResize: ResizeCallback = (_e, _direction, ref) => {
        const clamped = parseWidthFromRef(ref as HTMLDivElement);
        if (clamped == null) {
            return;
        }
        setWidth(clamped);
    };

    // Persist width only when the drag ends.
    const handleResizeStop: ResizeCallback = (_e, _direction, ref) => {
        const clamped = parseWidthFromRef(ref as HTMLDivElement);
        if (clamped == null) {
            return;
        }

        setWidth(clamped);

        // If user expands the nav, consider it "not collapsed" for layout offsets.
        // If user shrinks below threshold, consider it collapsed.
        const nextCollapsed = clamped < collapsedThresholdWidth;
        if (nextCollapsed !== sidebarCollapsed) {
            setSidebarCollapsed(nextCollapsed);
        }

        // Persist last expanded width separately so collapsing doesn't lose it.
        if (clamped >= collapsedThresholdWidth) {
            safeStorageSetItem(NAV_WIDTH_EXPANDED_KEY, String(clamped));
        }
        safeStorageSetItem(NAV_WIDTH_KEY, String(clamped));
    };

    useEffect(() => {
        // Initialize width from persisted value (prefer expanded value).
        const expandedWidth = safeStorageGetItem(NAV_WIDTH_EXPANDED_KEY);
        const navigationWidth = safeStorageGetItem(NAV_WIDTH_KEY);
        const raw =
            expandedWidth != null
                ? Number(expandedWidth)
                : navigationWidth != null
                ? Number(navigationWidth)
                : defaultWidth;

        if (!Number.isFinite(raw)) {
            return;
        }

        setWidth(clampWidth(raw));
    }, []);

    useEffect(() => {
        // When collapsed, snap to minWidth. When expanded, restore last expanded width.
        if (sidebarCollapsed) {
            if (width !== minWidth) {
                setWidth(minWidth);
            }
            safeStorageSetItem(NAV_WIDTH_KEY, String(minWidth));
            return;
        }

        const expandedWidth = safeStorageGetItem(NAV_WIDTH_EXPANDED_KEY);
        const fallback = safeStorageGetItem(NAV_WIDTH_KEY);
        const raw =
            expandedWidth != null
                ? Number(expandedWidth)
                : fallback != null
                ? Number(fallback)
                : defaultWidth;

        if (!Number.isFinite(raw)) {
            return;
        }

        // If the restored value is collapsed-sized, default back to defaultWidth.
        const clamped = clampWidth(raw);
        const safe =
            clamped >= collapsedThresholdWidth
                ? clamped
                : clampWidth(defaultWidth);

        if (width !== safe) {
            setWidth(safe);
        }
        safeStorageSetItem(NAV_WIDTH_KEY, String(safe));
    }, [sidebarCollapsed]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            css={`
                width: ${width}px;
                flex-shrink: 0;
            `}
        >
            <Resizable
                size={{ width, height: '100vh' }}
                style={{ position: 'fixed', zIndex: 100 }}
                minWidth={minWidth}
                maxWidth={maxWidth}
                enable={{
                    right: true,
                }}
                onResize={handleResize}
                onResizeStop={handleResizeStop}
                handleComponent={{
                    right: <Styled.Handle />,
                }}
                css={`
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background-color: ${colors.Gray[50]};
                    padding: 24px 16px;
                    border-right: 1px solid ${colors.Gray[200]};
                    position: sticky;
                    top: 0;
                `}
            >
                <div
                    css={`
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        width: 100%;
                    `}
                >
                    <NavigationLogo
                        organization={organization}
                        simplifiedView={simplifiedView}
                        width={width}
                    />
                    <div
                        css={`
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                            align-items: center;
                        `}
                    >
                        {routes
                            .filter(
                                (route) =>
                                    route.route !== 'settings' &&
                                    route.route !== 'relay/settings'
                            )
                            .map((route) => (
                                <Fragment key={route.route}>
                                    <NavigationButton
                                        key={route.route}
                                        isActive={active === route.route}
                                        simplifiedView={simplifiedView}
                                        icon={route.icon}
                                        label={route.label}
                                        to={`/${route.route}`}
                                        hasSubRoutes={
                                            route.routes &&
                                            route.routes.length > 0
                                        }
                                        isExpanded={routeExpanded}
                                        setIsExpanded={setRouteExpanded}
                                        notificationCount={getNotificationCount(
                                            route.route
                                        )}
                                        width={width}
                                    />
                                    {route.routes &&
                                        route.routes.length > 0 &&
                                        routeExpanded && (
                                            <div
                                                css={`
                                                    display: flex;
                                                    flex-direction: column;
                                                    ${!simplifiedView
                                                        ? 'width: 100%;'
                                                        : ''}
                                                    padding-bottom: 8px;
                                                    border-bottom: 1px solid
                                                        ${colors.Gray[200]};
                                                `}
                                            >
                                                {route.routes.map(
                                                    (subRoute) => (
                                                        <NavigationButton
                                                            key={subRoute.route}
                                                            isActive={
                                                                active ===
                                                                subRoute.route
                                                            }
                                                            simplifiedView={
                                                                simplifiedView
                                                            }
                                                            label={
                                                                subRoute.label
                                                            }
                                                            to={`/${subRoute.route}`}
                                                            notificationCount={getNotificationCount(
                                                                subRoute.route
                                                            )}
                                                            isSubRoute={true}
                                                            icon={
                                                                !simplifiedView
                                                                    ? undefined
                                                                    : subRoute.icon
                                                            }
                                                            width={width}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                </Fragment>
                            ))}
                    </div>
                </div>
                <div
                    css={`
                        display: flex;
                        flex: 1;
                    `}
                />
                <div
                    css={`
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        width: 100%;
                    `}
                >
                    {showNFLAdminSwitch && onNFLAdminToggle && (
                        <div
                            css={`
                                display: flex;
                                width: 100%;
                                justify-content: center;
                                padding: 0 8px;
                            `}
                        >
                            <NFLAdminSwitch
                                isNFLAdmin={isNFLAdmin}
                                onToggle={onNFLAdminToggle}
                                simplifiedView={simplifiedView}
                                width={width}
                            />
                        </div>
                    )}
                    <div
                        css={`
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                            align-items: center;
                        `}
                    >
                        {routes
                            .filter(
                                (route) =>
                                    route.route === 'settings' ||
                                    route.route === 'relay/settings'
                            )
                            .map((route) => (
                                <NavigationButton
                                    key={route.route}
                                    isActive={active === route.route}
                                    simplifiedView={simplifiedView}
                                    icon={route.icon}
                                    label={route.label}
                                    to={`/${route.route}`}
                                    notificationCount={getNotificationCount(
                                        route.route
                                    )}
                                    width={width}
                                />
                            ))}
                        <div
                            css={`
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 100%;
                            `}
                            onClick={handleSupportClick}
                        >
                            <NavigationButton
                                isActive={false}
                                simplifiedView={simplifiedView}
                                icon={({ color, size }) => (
                                    <Message
                                        color={color}
                                        size={size}
                                        variant="chat-circle"
                                    />
                                )}
                                label="Support"
                                width={width}
                            />
                        </div>
                    </div>
                    <AccountButton
                        width={width - 32}
                        simplifiedView={simplifiedView}
                    />
                    <div
                        css={`
                            display: flex;
                            ${simplifiedView
                                ? 'padding: 10px;'
                                : 'padding-top: 8px;'}
                            width: 100%;
                            justify-content: ${simplifiedView
                                ? 'center'
                                : 'flex-start'};
                            align-items: center;
                        `}
                    >
                        {simplifiedView ? (
                            <img src={cxBlue} alt="CX" />
                        ) : (
                            <img src={sponsorcxBlackAndBlue} alt="SponsorCX" />
                        )}
                    </div>
                </div>
            </Resizable>
        </div>
    );
};

export default ApplicationNavigation;
