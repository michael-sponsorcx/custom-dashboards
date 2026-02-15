import { CXIconProps } from '@/assets/icons/IconProps';

const IntersectCircle = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14"
        />
    </svg>
);
export default IntersectCircle;
