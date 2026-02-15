import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
`;

export const Field = styled.div`
    display: flex;
    align-items: center;
`;

export const FieldLabel = styled.div`
    align-items: center;
    display: flex;
    flex: 1;
    gap: 8px;
    min-width: 50%;
`;

export const FieldValue = styled.div<{ $includeHover?: boolean }>`
    align-items: center;
    display: flex;
    flex: 1;
    gap: 8px;

    padding-left: 10.5px;
    padding-right: 10.5px;
`;

export const TriggerContainer = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
    cursor: pointer;
`;
