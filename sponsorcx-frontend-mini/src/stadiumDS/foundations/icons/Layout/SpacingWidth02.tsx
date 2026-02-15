import { CXIconProps } from '@/assets/icons/IconProps';

const SpacingWidth02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 21V3M3 21V3m3.5 9h11m0 3V9m-11 6V9"
        />
    </svg>
);
export default SpacingWidth02;
