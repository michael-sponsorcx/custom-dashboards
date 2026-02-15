import { CXIconProps } from '@/assets/icons/IconProps';

const AlignCenter = ({ color, size = '16' }: CXIconProps) => (
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
            d="M18 10H6m15-4H3m18 8H3m15 4H6"
        />
    </svg>
);
export default AlignCenter;
