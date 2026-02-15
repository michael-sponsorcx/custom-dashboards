import styled from 'styled-components';

export const Ring = styled.div<{ $size: number; $color: string }>`
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    border-radius: 50%;
    background-color: ${({ $color }) => $color};
    display: flex;
    align-items: center;
    justify-content: center;
`;
