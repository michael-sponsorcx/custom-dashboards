import { CXIconProps } from '@/assets/icons/IconProps';

const PieChart04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 12 2.332 9.446a10 10 0 0 0 5.922 11.826zm0 0 .105-10A10 10 0 0 0 2.34 9.413zm10 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10"
        />
    </svg>
);
export default PieChart04;
