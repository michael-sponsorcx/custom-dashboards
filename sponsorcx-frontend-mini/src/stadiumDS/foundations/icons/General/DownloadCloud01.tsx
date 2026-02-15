import { CXIconProps } from '@/assets/icons/IconProps';

const DownloadCloud01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M4 15.242A4.5 4.5 0 0 1 6.08 7.02a6.002 6.002 0 0 1 11.84 0A4.5 4.5 0 0 1 20 15.242M8 16l4 4m0 0 4-4m-4 4v-9"
        />
    </svg>
);
export default DownloadCloud01;
