import { CXIconProps } from '@/assets/icons/IconProps';

const HeartHexagon = ({ color, size = '16' }: CXIconProps) => (
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
            d="M11.223 1.432c.284-.158.425-.237.575-.268a1 1 0 0 1 .403 0c.15.031.292.11.576.268l7.4 4.11c.3.167.45.25.558.369a1 1 0 0 1 .215.364c.05.152.05.324.05.666v8.118c0 .342 0 .514-.05.666a1 1 0 0 1-.215.364c-.109.119-.258.202-.558.368l-7.4 4.111c-.284.158-.425.237-.575.267q-.201.042-.403 0c-.15-.03-.292-.11-.576-.267l-7.4-4.11c-.3-.167-.45-.25-.558-.369a1 1 0 0 1-.215-.364C3 15.573 3 15.401 3 15.06V6.94c0-.342 0-.514.05-.666a1 1 0 0 1 .215-.364c.109-.119.258-.202.558-.368z"
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
export default HeartHexagon;
