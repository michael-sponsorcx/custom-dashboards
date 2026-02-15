import { CXIconProps } from '@/assets/icons/IconProps';

const Loading01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 1.25v2.5M12 17v4M5.75 11h-3.5m19 0h-1.5m-1.293 6.457-.707-.707m.914-12.334L17.25 5.83M4.922 18.078 7.75 15.25M5.129 4.209 7.25 6.33"
        />
    </svg>
);
export default Loading01;
