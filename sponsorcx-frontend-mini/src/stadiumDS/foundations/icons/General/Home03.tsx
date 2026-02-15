import { CXIconProps } from '@/assets/icons/IconProps';

const Home03 = ({ color, size = '16' }: CXIconProps) => (
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
            d="M9 20v-7.4c0-.56 0-.84.109-1.054a1 1 0 0 1 .437-.437C9.76 11 10.04 11 10.6 11h2.8c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C15 11.76 15 12.04 15 12.6V20M2 8.5l9.04-6.78c.344-.258.516-.387.705-.437a1 1 0 0 1 .51 0c.189.05.36.179.705.437L22 8.5M4 7v9.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C5.52 20 6.08 20 7.2 20h9.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C20 18.48 20 17.92 20 16.8V7l-6.08-4.56c-.688-.516-1.033-.775-1.41-.874a2 2 0 0 0-1.02 0c-.377.1-.722.358-1.41.874z"
        />
    </svg>
);
export default Home03;
