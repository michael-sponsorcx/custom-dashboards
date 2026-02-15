import { CXIconProps } from '@/assets/icons/IconProps';

const Recording02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 10v4m4.5-3v2M12 6v12m4.5-15v18M21 10v4"
        />
    </svg>
);
export default Recording02;
