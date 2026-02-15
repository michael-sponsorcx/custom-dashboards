import { CXIconProps } from '@/assets/icons/IconProps';

const AlignLeft = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16 10H3m17-4H3m17 8H3m13 4H3"
        />
    </svg>
);
export default AlignLeft;
