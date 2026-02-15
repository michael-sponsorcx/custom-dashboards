import { CXIconProps } from '@/assets/icons/IconProps';

const Power01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 2v10m6.36-5.36a9 9 0 1 1-12.73 0"
        />
    </svg>
);
export default Power01;
