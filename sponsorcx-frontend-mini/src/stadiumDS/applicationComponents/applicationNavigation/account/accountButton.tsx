import 'styled-components/macro';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { Avatar } from '@/components/UserInfo';
import { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '@/context';
import Chevron from '@/stadiumDS/foundations/icons/Arrows/Chevron';
import useStore from '@/state';
import { secondaryColors } from '@/stadiumDS/foundations/colors/secondary';
import { AccountMenu } from './accountMenu';

export const AccountButton = ({
    width,
    simplifiedView,
}: {
    width: number;
    simplifiedView: boolean;
}) => {
    const { user } = useContext(UserContext);
    const organization = useStore((state) => state.organization);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMenuOpenRef = useRef(isMenuOpen);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                containerRef.current &&
                containerRef.current.contains(event.target as Node) &&
                !isMenuOpenRef.current
            ) {
                setIsMenuOpen(true);
                isMenuOpenRef.current = true;
            } else if (
                isMenuOpenRef.current &&
                !menuRef.current?.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
                isMenuOpenRef.current = false;
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div
            ref={containerRef}
            css={`
                position: relative;
            `}
        >
            <div ref={menuRef}>
                <AccountMenu
                    width={width}
                    isOpen={isMenuOpen}
                    setIsOpen={(isOpen) => {
                        setIsMenuOpen(isOpen);
                        isMenuOpenRef.current = isOpen;
                    }}
                />
            </div>
            <div>
                {simplifiedView ? (
                    <div
                        css={`
                            cursor: pointer;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `}
                    >
                        <Avatar user={user} size={40} removeMargin />
                    </div>
                ) : (
                    <div
                        css={`
                            display: flex;
                            flex-direction: row;
                            width: ${width}px;
                            gap: 8px;
                            align-items: center;
                            padding: 12px;
                            background-color: ${primaryColors.Gray[25]};
                            border-radius: 12px;
                            border: 1px solid ${primaryColors.Gray[200]};
                            box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
                            cursor: pointer;
                            position: relative;
                        `}
                    >
                        <div
                            css={`
                                position: absolute;
                                top: 6px;
                                right: 6px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding: 6px;
                            `}
                        >
                            <Chevron
                                color={primaryColors.Gray[500]}
                                size={'20'}
                                variant="selector-vertical"
                            />
                        </div>
                        <Avatar user={user} size={40} removeMargin />
                        <div
                            css={`
                                display: flex;
                                flex-direction: column;
                            `}
                        >
                            <div
                                css={`
                                    display: flex;
                                    flex-direction: row;
                                    gap: 6px;
                                    max-width: ${width - 98}px;
                                    align-items: flex-start;
                                `}
                            >
                                <div
                                    css={`
                                        font-size: 14px;
                                        font-weight: 600;
                                        color: ${primaryColors.Gray[900]};
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        white-space: nowrap;
                                    `}
                                >
                                    {user.first_name} {user.last_name}
                                </div>
                                {organization.is_demo && width > 176 && (
                                    <div
                                        css={`
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            padding: 2px 8px;
                                            border-radius: 16px;
                                            border: 1px solid
                                                ${primaryColors.Brand[200]};
                                            background-color: ${primaryColors
                                                .Brand[50]};
                                            color: ${secondaryColors.Blue[700]};
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 16px;
                                        `}
                                    >
                                        Demo
                                    </div>
                                )}
                            </div>
                            <div
                                css={`
                                    color: ${primaryColors.Gray[600]};
                                    max-width: ${width - 72}px;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                `}
                            >
                                {user.czar ? `${organization.id} - ` : ''}
                                {organization.name}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
