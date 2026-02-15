import { CXIconProps } from '@/assets/icons/IconProps';

const Rss01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M6 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        />
    </svg>
);
export default Rss01;
