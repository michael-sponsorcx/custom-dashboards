import { UploadsCellProps } from './UploadsCells';

export const UploadsOriginCell = ({
    info,
    originHelperFn,
}: UploadsCellProps & { originHelperFn: (recordType: string) => string }) => {
    const recordType = info.getValue();
    return originHelperFn(recordType);
};
