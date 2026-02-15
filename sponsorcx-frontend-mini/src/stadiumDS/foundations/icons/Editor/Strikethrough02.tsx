import { CXIconProps } from '@/assets/icons/IconProps';

const Strikethrough02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 16a4 4 0 0 0 4 4h4a4 4 0 0 0 0-8m-3.5 8a4 4 0 0 0 0-8M18 8a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4m7.5-4a4 4 0 0 0-4 4M3 12h18"
        />
    </svg>
);
export default Strikethrough02;
