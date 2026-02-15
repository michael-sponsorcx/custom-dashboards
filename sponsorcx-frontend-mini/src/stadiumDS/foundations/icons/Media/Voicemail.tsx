import { CXIconProps } from '@/assets/icons/IconProps';

const Voicemail = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 16h12M6 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8m12 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8"
        />
    </svg>
);
export default Voicemail;
