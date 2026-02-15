import { CXIconProps } from '@/assets/icons/IconProps';

const Signal03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M10.586 13.414a2 2 0 1 1 2.828 0m-5.657 2.829a6 6 0 1 1 8.486 0M4.929 19.07c-3.905-3.905-3.905-10.237 0-14.142s10.237-3.905 14.142 0 3.905 10.237 0 14.142"
        />
    </svg>
);
export default Signal03;
