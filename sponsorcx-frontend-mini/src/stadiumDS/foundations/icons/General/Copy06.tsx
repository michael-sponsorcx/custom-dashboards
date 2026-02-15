import { CXIconProps } from '@/assets/icons/IconProps';

const Copy06 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M7.5 2h7.1c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 5.04 21 6.16 21 8.4v7.1M6.2 20h8.1c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108V8.7c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C15.98 5.5 15.42 5.5 14.3 5.5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 7.02 3 7.58 3 8.7v8.1c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 20 5.08 20 6.2 20"
        />
    </svg>
);
export default Copy06;
