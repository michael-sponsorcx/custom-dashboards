import { CXIconProps } from '@/assets/icons/IconProps';

const Cloud02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 19a4 4 0 0 1-.999-7.874L5 11a7 7 0 0 1 13.96-.758A4.502 4.502 0 0 1 17.5 19z"
        />
    </svg>
);
export default Cloud02;
