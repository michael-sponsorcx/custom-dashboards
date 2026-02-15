import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import { useState } from 'react';
import 'styled-components/macro';

interface StadiumButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    bordered?: boolean;
    padding?: string;
    backgroundColor?: string;
    activeOutlineColor?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * @deprecated need to switch to use the Mantine Button component instead
 */
const StadiumButton = ({
    children,
    onClick,
    disabled,
    bordered,
    padding = '4px 8px',
    backgroundColor = primaryColors.Base.White,
    activeOutlineColor = primaryColors.Gray[400],
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
}: StadiumButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (onKeyDown) {
            onKeyDown(e);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) {
                onClick();
            }
        }
    };

    return (
        <div
            tabIndex={disabled ? undefined : 0}
            onMouseEnter={() => {
                setIsHovered(true);
                onMouseEnter?.();
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                onMouseLeave?.();
            }}
            onClick={() => !disabled && onClick()}
            onKeyDown={handleKeyDown}
            css={`
                padding: ${padding};
                background-color: ${isHovered && !disabled
                    ? primaryColors.Gray[50]
                    : backgroundColor};
                border-radius: 6px;
                cursor: ${disabled ? 'default' : 'pointer'};
                ${bordered
                    ? `box-shadow: 0px 0px 0px 1px rgba(10, 13, 18, ${
                          disabled ? '0.1' : '0.18'
                      }) inset, 0px -2px 0px 0px rgba(10, 13, 18, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);`
                    : ''}
                ${!disabled
                    ? `
                    &:focus {
                        outline: none;
                        box-shadow: ${
                            bordered
                                ? `0px 0px 0px 1px rgba(10, 13, 18, 0.18) inset, 0px -2px 0px 0px rgba(10, 13, 18, 0.05) inset, 0px 1px 2px 0px rgba(10, 13, 18, 0.05),`
                                : ''
                        } 0px 0px 0px 2px #FFF, 0px 0px 0px 4px ${activeOutlineColor};
                        ${
                            !bordered &&
                            `background-color: ${primaryColors.Gray[50]};`
                        }
                    }
                `
                    : ''}
            `}
        >
            {children}
        </div>
    );
};

export default StadiumButton;
