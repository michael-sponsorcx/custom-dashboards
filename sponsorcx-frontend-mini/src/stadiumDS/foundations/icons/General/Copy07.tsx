import { CXIconProps } from '@/assets/icons/IconProps';

const Copy07 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M10.5 1.003c-.675.009-1.08.048-1.408.215a2 2 0 0 0-.874.874c-.167.328-.206.733-.215 1.408M19.5 1.003c.675.009 1.08.048 1.408.215a2 2 0 0 1 .874.874c.167.328.206.733.215 1.408m0 9c-.009.675-.048 1.08-.215 1.408a2 2 0 0 1-.874.874c-.328.167-.733.206-1.408.215M22 7v2m-8-8h2M5.2 21h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C16 19.48 16 18.92 16 17.8v-7.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 7 13.92 7 12.8 7H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 8.52 2 9.08 2 10.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 21 4.08 21 5.2 21"
        />
    </svg>
);
export default Copy07;
