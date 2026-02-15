import { CXIconProps } from '@/assets/icons/IconProps';

const ZapSquare = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 2 6.12 2 7.8 2h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 4.28 21 5.12 21 6.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 20 17.88 20 16.2 20H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 17.72 3 16.88 3 15.2z"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m12 5-4.566 6.227c-.301.41-.452.616-.447.787a.5.5 0 0 0 .193.38c.135.106.39.106.899.106H12V17l4.566-6.227c.301-.41.452-.616.447-.787a.5.5 0 0 0-.193-.38c-.135-.106-.39-.106-.899-.106H12z"
        />
    </svg>
);
export default ZapSquare;
