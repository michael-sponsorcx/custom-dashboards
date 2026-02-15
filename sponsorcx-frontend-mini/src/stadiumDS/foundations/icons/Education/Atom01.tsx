import { CXIconProps } from '@/assets/icons/IconProps';

const Atom01 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 12h.01m3.525 3.536c-4.686 4.686-10.068 6.902-12.02 4.95-1.953-1.953.263-7.335 4.949-12.021s10.068-6.903 12.02-4.95c1.953 1.952-.263 7.334-4.949 12.02m0-7.072c4.686 4.687 6.902 10.069 4.95 12.021-1.953 1.953-7.335-.263-12.021-4.95-4.686-4.686-6.902-10.068-4.95-12.02 1.953-1.953 7.335.263 12.021 4.95M12.499 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
        />
    </svg>
);
export default Atom01;
