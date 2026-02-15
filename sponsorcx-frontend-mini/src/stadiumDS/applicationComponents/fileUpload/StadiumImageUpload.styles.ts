import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1;
`;

export const ImageContainer = styled.img`
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 50%;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
`;

export const TextButton = styled.div<{ $color: string }>`
    display: flex;
    padding: 0 2px;
    color: ${(props) => props.$color};
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    cursor: pointer;
`;
