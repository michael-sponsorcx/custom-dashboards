import { CXIconProps } from '@/assets/icons/IconProps';

const Pilcrow02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M17.5 4v16m2-16H9a4 4 0 1 0 0 8h5m0-8v16m-2 0h7.5"
        />
    </svg>
);
export default Pilcrow02;
