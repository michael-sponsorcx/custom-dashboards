import { CXIconProps } from '@/assets/icons/IconProps';

const BookmarkX = ({ color, size = '16' }: CXIconProps) => (
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
            d="m9.5 6.5 5 5m0-5-5 5M19 20V6.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C16.72 2 15.88 2 14.2 2H9.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C5 4.28 5 5.12 5 6.8V20l7-4z"
        />
    </svg>
);
export default BookmarkX;
