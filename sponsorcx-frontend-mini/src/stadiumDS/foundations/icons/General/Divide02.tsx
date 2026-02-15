import { CXIconProps } from '@/assets/icons/IconProps';

const Divide02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M4 11h16m-6-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0m0 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
        />
    </svg>
);
export default Divide02;
