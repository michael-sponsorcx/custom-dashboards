import { CXIconProps } from '@/assets/icons/IconProps';

const AlignRight = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 10H8m13-4H4m17 8H4m17 4H8"
        />
    </svg>
);
export default AlignRight;
