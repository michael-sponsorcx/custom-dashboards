import { CXIconProps } from '@/assets/icons/IconProps';

const Speedometer02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M22 11c0 5.523-4.477 10-10 10S2 16.523 2 11m20 0c0-5.523-4.477-10-10-10m10 10h-2.5M2 11C2 5.477 6.477 1 12 1M2 11h2.5M12 1v2.5m7.078.5L13.5 9.5m5.578 8.578-.203-.203c-.692-.692-1.038-1.038-1.442-1.286a4 4 0 0 0-1.156-.479c-.46-.11-.95-.11-1.928-.11H9.651c-.978 0-1.468 0-1.928.11a4 4 0 0 0-1.156.48c-.404.247-.75.593-1.442 1.285l-.203.203M4.922 4l1.736 1.736M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
        />
    </svg>
);
export default Speedometer02;
