import { CXIconProps } from '@/assets/icons/IconProps';

const Copy04 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16 15v2.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C14.48 21 13.92 21 12.8 21H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C2 19.48 2 18.92 2 17.8v-7.6c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 7 4.08 7 5.2 7H8m3.2 8h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 13.48 22 12.92 22 11.8V4.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 1 19.92 1 18.8 1h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 2.52 8 3.08 8 4.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C9.52 15 10.08 15 11.2 15"
        />
    </svg>
);
export default Copy04;
