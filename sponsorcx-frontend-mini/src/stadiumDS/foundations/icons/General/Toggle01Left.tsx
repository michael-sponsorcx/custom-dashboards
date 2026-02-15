import { CXIconProps } from '@/assets/icons/IconProps';

const Toggle01Left = ({ color, size = '16' }: CXIconProps) => (
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
            d="M7 16h10a5 5 0 0 0 0-10H7m0 10A5 5 0 0 1 7 6m0 10A5 5 0 0 0 7 6"
        />
    </svg>
);
export default Toggle01Left;
