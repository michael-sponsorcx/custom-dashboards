export const Page = ({ height = 40 }: { height?: number }) => {
    const width = (height / 40) * 33;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 33 40"
            fill="none"
        >
            <path
                d="M4.5 0.75H20.5C20.5911 0.75 20.6793 0.777281 20.7539 0.827148L20.8232 0.883789L31.6162 11.6768C31.7019 11.7625 31.75 11.8788 31.75 12V36C31.75 37.7949 30.2949 39.25 28.5 39.25H4.5C2.70507 39.25 1.25 37.7949 1.25 36V4C1.25 2.20507 2.70508 0.75 4.5 0.75Z"
                fill="white"
                stroke="#D5D7DA"
                strokeWidth="1.5"
            />
            <path
                d="M20.5 0.5V8C20.5 10.2091 22.2909 12 24.5 12H32"
                stroke="#D5D7DA"
                strokeWidth="1.5"
            />
        </svg>
    );
};
