import { CXIconProps } from '@/assets/icons/IconProps';

const LogIn03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M6 16c0 .351 0 .527.016.68a3 3 0 0 0 2.286 2.611c.15.036.324.059.672.105l6.592.88c1.876.25 2.814.375 3.542.085a3 3 0 0 0 1.509-1.32c.383-.684.383-1.63.383-3.524V6.483c0-1.893 0-2.84-.383-3.523a3 3 0 0 0-1.509-1.32c-.728-.29-1.666-.165-3.542.086l-6.592.878c-.349.047-.523.07-.672.106A3 3 0 0 0 6.016 5.32C6 5.473 6 5.65 6 6m6 1 4 4m0 0-4 4m4-4H3"
        />
    </svg>
);
export default LogIn03;
