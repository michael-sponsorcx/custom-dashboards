import { CXIconProps } from '@/assets/icons/IconProps';

interface ArrowUpRightProps extends CXIconProps {
    strokeWidth?: number;
}

const ArrowUpRight = ({
    color,
    size = '16',
    strokeWidth = 1.5,
}: ArrowUpRightProps) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            d="M7 17 17 7m0 0H7m10 0v10"
        />
    </svg>
);
export default ArrowUpRight;
