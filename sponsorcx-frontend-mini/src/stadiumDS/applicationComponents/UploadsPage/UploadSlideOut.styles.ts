import colors from '@/stadiumDS/foundations/colors';
import styled from 'styled-components';

export const UploadContainer = styled.div`
    width: 100%;
    height: 340px;
    background-color: ${colors.Gray[100]};
    padding: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: ${colors.Gray[200]};
    }
`;
