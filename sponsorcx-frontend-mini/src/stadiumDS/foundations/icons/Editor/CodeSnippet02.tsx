import { CXIconProps } from '@/assets/icons/IconProps';

const CodeSnippet02 = ({ color, size = '16' }: CXIconProps) => (
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
            d="m17 17 5-5-5-5M7 7l-5 5 5 5m7-14-4 18"
        />
    </svg>
);
export default CodeSnippet02;
