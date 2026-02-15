import { Dropzone } from '@/components/Dropzone';
import { StadiumDropzoneTrigger } from './StadiumDropzoneTrigger';

interface StadiumDropzoneProps {
    onUpload?: (key: string) => void;
    logo?: string;
    prefixKey: string;
    skipConfirm?: boolean;
    pick?: string;
    description?: string;
}

export const StadiumDropzone = ({
    onUpload,
    logo,
    prefixKey,
    skipConfirm,
    pick,
    description,
}: StadiumDropzoneProps) => {
    return (
        <Dropzone
            aspect={1}
            onUpload={(key) => {
                onUpload?.(key);
            }}
            logo={logo}
            prefixKey={prefixKey}
            skipConfirm={skipConfirm}
            pick={pick}
            trigger={<StadiumDropzoneTrigger description={description} />}
            triggerContainerStyle={{
                display: 'flex',
                flex: 1,
            }}
            skipCrop
        />
    );
};
