import { CXIconProps } from '@/assets/icons/IconProps';

const Copy02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M16 7V4.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 1 13.92 1 12.8 1H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 2.52 2 3.08 2 4.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 15 4.08 15 5.2 15H8m3.2 6h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 19.48 22 18.92 22 17.8v-7.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 7 19.92 7 18.8 7h-7.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 8.52 8 9.08 8 10.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C9.52 21 10.08 21 11.2 21"
        />
    </svg>
);
export default Copy02;
