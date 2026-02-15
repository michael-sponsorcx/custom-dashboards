import styled from 'styled-components';

export const CardViewContainer = styled.div<{ $height: string }>`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: thin;
    height: ${({ $height }) => $height};
`;

export const CardsContainer = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    width: 100%;
`;
