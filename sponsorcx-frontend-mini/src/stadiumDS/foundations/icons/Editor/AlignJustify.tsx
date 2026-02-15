import { CXIconProps } from '@/assets/icons/IconProps';

const AlignJustify = ({ color, size = '16' }: CXIconProps) => (
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
            d="M21 10H3m18 8H3M21 6H3m18 8H3"
        />
    </svg>
);
export default AlignJustify;
