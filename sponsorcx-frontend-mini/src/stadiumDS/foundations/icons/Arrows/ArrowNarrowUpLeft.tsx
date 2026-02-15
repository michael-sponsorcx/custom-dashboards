import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowNarrowUpLeft = ({ color, size = '16' }: CXIconProps) => (
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
            strokeWidth={1.5}
            d="M18 18 6 6m0 0v8m0-8h8"
        />
    </svg>
);
export default ArrowNarrowUpLeft;
