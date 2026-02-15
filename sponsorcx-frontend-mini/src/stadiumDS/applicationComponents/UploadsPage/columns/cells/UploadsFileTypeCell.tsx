import { UploadsCellProps } from './UploadsCells';

export const UploadsFileTypeCell = ({ info }: UploadsCellProps) => {
    return info.getValue() ?? '--';
};
