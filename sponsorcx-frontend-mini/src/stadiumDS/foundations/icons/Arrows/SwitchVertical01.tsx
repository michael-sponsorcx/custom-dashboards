import { CXIconProps } from '@/assets/icons/IconProps';

const SwitchVertical01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M17 4v16m0 0-4-4m4 4 4-4M7 20V4m0 0L3 8m4-4 4 4"
        />
    </svg>
);
export default SwitchVertical01;
