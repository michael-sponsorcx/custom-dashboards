import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowsUp = ({ color, size = '16' }: CXIconProps) => (
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
            d="M7 20V4m0 0L3 8m4-4 4 4m6 12V9m0 0-4 4m4-4 4 4"
        />
    </svg>
);
export default ArrowsUp;
