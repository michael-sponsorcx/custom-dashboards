import { CXIconProps } from '@/assets/icons/IconProps';

const HeartCircle = ({ color, size = '16' }: CXIconProps) => (
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
            d="M12 21c5.523 0 10-4.477 10-10S17.523 1 12 1 2 5.477 2 11s4.477 10 10 10"
        />
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.997 8.068c-1-1.169-2.667-1.483-3.92-.413-1.252 1.07-1.429 2.86-.445 4.125.63.81 2.244 2.314 3.322 3.29.359.325.538.487.753.552.184.056.395.056.58 0 .214-.065.393-.227.752-.552 1.079-.976 2.692-2.48 3.322-3.29.984-1.265.829-3.066-.445-4.125s-2.92-.756-3.92.413"
            clipRule="evenodd"
        />
    </svg>
);
export default HeartCircle;
