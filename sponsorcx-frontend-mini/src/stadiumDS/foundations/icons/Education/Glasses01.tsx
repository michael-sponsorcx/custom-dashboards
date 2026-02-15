import { CXIconProps } from '@/assets/icons/IconProps';

const Glasses01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M10 11.535a4.01 4.01 0 0 1 4 0M8.828 9.172a4 4 0 1 1-5.657 5.656 4 4 0 0 1 5.657-5.656m12 0a4 4 0 1 1-5.656 5.656 4 4 0 0 1 5.656-5.656"
        />
    </svg>
);
export default Glasses01;
