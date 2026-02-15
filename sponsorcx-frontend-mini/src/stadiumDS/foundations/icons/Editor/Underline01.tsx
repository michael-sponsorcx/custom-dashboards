import { CXIconProps } from '@/assets/icons/IconProps';

const Underline01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M18 4v7a6 6 0 0 1-12 0V4M4 21h16"
        />
    </svg>
);
export default Underline01;
