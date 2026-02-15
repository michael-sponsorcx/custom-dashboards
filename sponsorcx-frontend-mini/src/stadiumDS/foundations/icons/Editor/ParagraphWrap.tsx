import { CXIconProps } from '@/assets/icons/IconProps';

const ParagraphWrap = ({ color, size = '16' }: CXIconProps) => (
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
            d="M3 6h18M3 12h15a3 3 0 0 1 0 6h-4m0 0 2-2m-2 2 2 2M3 18h7"
        />
    </svg>
);
export default ParagraphWrap;
