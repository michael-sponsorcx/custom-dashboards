import { CXIconProps } from '@/assets/icons/IconProps';

const CloudSun03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3.15 11a7.5 7.5 0 1 1 14.784-2.5M6 22a4 4 0 1 1 .337-7.986 6.003 6.003 0 0 1 10.866-1.004q.147-.01.297-.01a4.5 4.5 0 1 1 0 9z"
        />
    </svg>
);
export default CloudSun03;
