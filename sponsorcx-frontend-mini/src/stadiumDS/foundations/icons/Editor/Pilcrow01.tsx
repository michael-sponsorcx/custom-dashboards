import { CXIconProps } from '@/assets/icons/IconProps';

const Pilcrow01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16 4v16m0-16h2m-2 0h-5.5a4.5 4.5 0 0 0 0 9H16zm-2 16h4"
        />
    </svg>
);
export default Pilcrow01;
