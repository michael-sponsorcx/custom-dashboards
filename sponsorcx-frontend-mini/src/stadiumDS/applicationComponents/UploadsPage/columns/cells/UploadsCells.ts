import { UploadNode } from '@/hooks/useUniversalUploadList';
import { CellContext } from '@tanstack/react-table';

export interface UploadsCellProps {
    info: CellContext<UploadNode, any>;
}
