import { CXIconProps } from '@/assets/icons/IconProps';

const Drop = ({ color, size = '16' }: CXIconProps) => (
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
            d="M20 14a8 8 0 1 1-15.418-3C5.768 8.068 12 2 12 2s6.232 6.068 7.419 9c.375.926.581 1.94.581 3"
        />
    </svg>
);
export default Drop;
