import { CXIconProps } from '@/assets/icons/IconProps';

const MusicNote01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9 18V6.355c0-.481 0-.722.088-.917a1 1 0 0 1 .358-.424c.178-.118.416-.158.891-.237l8.8-1.467c.64-.106.961-.16 1.211-.067a1 1 0 0 1 .52.44c.132.231.132.556.132 1.206V16M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0m12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
        />
    </svg>
);
export default MusicNote01;
