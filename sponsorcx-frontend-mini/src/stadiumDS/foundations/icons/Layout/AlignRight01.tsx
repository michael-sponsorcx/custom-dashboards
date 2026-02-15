import { CXIconProps } from '@/assets/icons/IconProps';

const AlignRight01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 21V3M3 12h14m0 0-7-7m7 7-7 7"
        />
    </svg>
);
export default AlignRight01;
