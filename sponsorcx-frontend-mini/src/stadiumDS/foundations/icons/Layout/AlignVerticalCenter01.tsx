import { CXIconProps } from '@/assets/icons/IconProps';

const AlignVerticalCenter01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 12h18M12 2v6.5m0 0 4-4m-4 4-4-4M12 22v-6.5m0 0 4 4m-4-4-4 4"
        />
    </svg>
);
export default AlignVerticalCenter01;
