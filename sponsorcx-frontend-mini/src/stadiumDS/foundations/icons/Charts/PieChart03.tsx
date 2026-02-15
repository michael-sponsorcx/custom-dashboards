import { CXIconProps } from '@/assets/icons/IconProps';

const PieChart03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 2a10 10 0 0 1 10 10M12 2v10m0-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10M12 2c5.523 0 10 4.477 10 10m0 0H12m10 0a10 10 0 0 1-4.122 8.09L12 12"
        />
    </svg>
);
export default PieChart03;
