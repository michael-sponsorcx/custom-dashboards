import colors from '@/stadiumDS/foundations/colors';
import styled, { css } from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    overflow-x: hidden;
`;

export const Field = styled.div<{ $overflow?: string }>`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 24px;

    overflow: ${({ $overflow }) => $overflow || 'hidden'};
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const FieldLabel = styled.div<{ $highlight?: boolean }>`
    align-items: center;
    display: flex;
    gap: 8px;
    border-radius: 4px;
    height: 24px;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    ${({ $highlight }) =>
        $highlight &&
        css`
            border: 1px solid ${colors.Error[500]};
        `}
`;

export const FieldValue = styled.div`
    align-items: center;
    display: flex;
    gap: 8px;
    flex: 1;
    width: 100%;
`;

export const FieldValueHover = styled(FieldValue)<{
    $pl?: number;
    $pr?: number;
}>`
    padding-left: ${({ $pl }) => ($pl !== undefined ? `${$pl}px` : '10.5px')};
    padding-right: ${({ $pr }) => ($pr !== undefined ? `${$pr}px` : '10.5px')};

    &:hover {
        border-radius: 8px;
        background-color: ${colors.Gray[50]};
    }
`;

export const EmptyPlusContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px dashed ${colors.Gray[300]};
    margin-left: 30px;
`;
