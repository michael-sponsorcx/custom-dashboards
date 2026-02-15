import { CXIconProps } from '@/assets/icons/IconProps';

const dMap = {
    sm: 'm21 20-6-6m2-5A7 7 0 1 1 3 9a7 7 0 0 1 14 0',
    md: 'm21 20-4.35-4.35M19 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    lg: 'm21 20-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
    refraction:
        'm21 20-4.35-4.35M11 5a5 5 0 0 1 5 5m3 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
};

interface SearchProps extends CXIconProps {
    variant: keyof typeof dMap;
}

const Search = ({ color, size = '16', variant }: SearchProps) => (
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
            d={dMap[variant]}
        />
    </svg>
);
export default Search;
