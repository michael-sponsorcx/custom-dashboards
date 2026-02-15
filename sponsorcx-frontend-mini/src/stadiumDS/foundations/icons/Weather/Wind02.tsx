import { CXIconProps } from '@/assets/icons/IconProps';

const Wind02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9.51 4.667A2 2 0 1 1 11 8H2m10.51 11.333A2 2 0 1 0 14 16H2m14.764-9A3 3 0 1 1 19 12H2"
        />
    </svg>
);
export default Wind02;
