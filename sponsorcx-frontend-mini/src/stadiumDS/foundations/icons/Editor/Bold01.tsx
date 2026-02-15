import { CXIconProps } from '@/assets/icons/IconProps';

const Bold01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 12h8a4 4 0 0 0 0-8H6zm0 0h9a4 4 0 0 1 0 8H6z"
        />
    </svg>
);
export default Bold01;
