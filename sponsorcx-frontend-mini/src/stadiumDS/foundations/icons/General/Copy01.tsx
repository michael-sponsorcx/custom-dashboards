import { CXIconProps } from '@/assets/icons/IconProps';

const Copy01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M5 14c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 12.398 2 11.932 2 11V4.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 1 4.08 1 5.2 1H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 2.602 15 3.068 15 4m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 19.48 22 18.92 22 17.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 8 19.92 8 18.8 8h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 9.52 9 10.08 9 11.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 21 11.08 21 12.2 21"
        />
    </svg>
);
export default Copy01;
