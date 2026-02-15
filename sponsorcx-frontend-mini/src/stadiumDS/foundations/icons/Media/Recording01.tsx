import { CXIconProps } from '@/assets/icons/IconProps';

const Recording01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 10v4m4.5-8v12M12 3v18m4.5-15v12m4.5-8v4"
        />
    </svg>
);
export default Recording01;
