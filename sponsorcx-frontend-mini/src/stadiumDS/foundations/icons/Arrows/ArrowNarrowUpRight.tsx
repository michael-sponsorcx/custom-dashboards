import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowNarrowUpRight = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 18 18 6m0 0h-8m8 0v8"
        />
    </svg>
);
export default ArrowNarrowUpRight;
