import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import StadiumButton from '@/stadiumDS/sharedComponents/buttons/StadiumButton';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'styled-components/macro';

interface BreadcrumbButtonProps {
    text: string;
    href: string;
    current?: boolean;
}

const BreadcrumbButton = ({ text, href, current }: BreadcrumbButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={href}
            css={`
                text-decoration: none;
            `}
            tabIndex={-1}
        >
            <StadiumButton
                onClick={() => {}}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                activeOutlineColor={primaryColors.Brand[400]}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.closest('a')?.click();
                    }
                }}
            >
                <div
                    css={`
                        color: ${!current && !isHovered
                            ? primaryColors.Gray[400]
                            : primaryColors.Gray[700]};
                        font-size: 14px;
                        font-weight: ${current ? 600 : 500};
                        max-width: 164px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    `}
                >
                    {text}
                </div>
            </StadiumButton>
        </Link>
    );
};

export default BreadcrumbButton;
