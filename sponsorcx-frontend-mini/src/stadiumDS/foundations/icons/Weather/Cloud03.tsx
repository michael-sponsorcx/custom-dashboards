import { CXIconProps } from '@/assets/icons/IconProps';

const Cloud03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9.5 19a7.5 7.5 0 1 1 6.641-10.988Q16.319 8 16.5 8a5.5 5.5 0 1 1 0 11z"
        />
    </svg>
);
export default Cloud03;
