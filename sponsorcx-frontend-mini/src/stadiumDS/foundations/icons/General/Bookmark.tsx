import { CXIconProps } from '@/assets/icons/IconProps';

const Bookmark = ({ color, size = '16' }: CXIconProps) => (
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
            d="M5 6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C7.28 2 8.12 2 9.8 2h4.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C19 4.28 19 5.12 19 6.8V20l-7-4-7 4z"
        />
    </svg>
);
export default Bookmark;
