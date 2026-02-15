import { CXIconProps } from '@/assets/icons/IconProps';

const HeartRounded = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16.111 2C19.633 2 22 5.353 22 8.48 22 14.814 12.178 20 12 20S2 14.814 2 8.48C2 5.352 4.367 2 7.889 2 9.91 2 11.233 3.024 12 3.924 12.767 3.024 14.089 2 16.111 2"
        />
    </svg>
);
export default HeartRounded;
