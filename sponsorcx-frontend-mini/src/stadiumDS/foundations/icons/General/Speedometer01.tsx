import { CXIconProps } from '@/assets/icons/IconProps';

const Speedometer01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 1v2.5M12 1C6.477 1 2 5.477 2 11M12 1c5.523 0 10 4.477 10 10m-10 7.5V21m0 0c5.523 0 10-4.477 10-10M12 21C6.477 21 2 16.523 2 11m2.5 0H2m20 0h-2.5m-.422 7.078-1.773-1.773M4.922 18.078l1.775-1.775M4.922 4l1.736 1.736M19.078 4 13.5 9.5M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
        />
    </svg>
);
export default Speedometer01;
