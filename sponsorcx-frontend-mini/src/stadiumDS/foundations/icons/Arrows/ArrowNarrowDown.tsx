import { CXIconProps } from '@/assets/icons/IconProps';

const ArrowNarrowDown = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 4v16m0 0 6-6m-6 6-6-6"
        />
    </svg>
);
export default ArrowNarrowDown;
