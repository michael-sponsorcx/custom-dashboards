import { CXIconProps } from '@/assets/icons/IconProps';

const CloudBlank02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9.5 18a7.5 7.5 0 1 1 6.641-10.988Q16.319 7 16.5 7a5.5 5.5 0 1 1 0 11z"
        />
    </svg>
);
export default CloudBlank02;
