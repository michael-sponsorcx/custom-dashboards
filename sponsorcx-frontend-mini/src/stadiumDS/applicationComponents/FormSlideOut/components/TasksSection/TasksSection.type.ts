import { UploadNode } from '@/hooks/useUniversalUploadList';
import { Item } from '@/stadiumDS/sharedComponents/menu/SelectMenu';

export interface TasksSectionTask {
    id: string;
    title?: string;
    assignee_ids?: string[];
    status?: string;
    due_at?: string | null;
    priority?: string | null;
    uploads?: UploadNode[];
    overdue?: boolean;
}

export interface TaskUploadProps {
    setHoveringUploadIds?: (ids: string[]) => void;
    recordType: string;
    refetchQueries?: string[];
    originHelperFn: () => string;
    refetch?: () => void;
    uploadRefetchCount?: number;
    uploads?: UploadNode[];
    handleDelete?: (ids: string[]) => Promise<void>;
    handleUpload?: (files: File[], taskId: string) => Promise<void>;
}

export interface TasksSectionRowProps {
    task: TasksSectionTask;
    onUpdateTask: (task: TasksSectionTask) => void;
    statusOptions?: Omit<Item, 'onClick'>[];
    priorityOptions?: Omit<Item, 'onClick'>[];
    userOptions?: Omit<Item, 'onClick'>[];
    uploadProps: TaskUploadProps;
    onDeleteTask: (taskId: string) => void;
    highlighted?: boolean;
    isTileView?: boolean;
    canEdit?: boolean;
}

export interface TasksSectionTemplateProps {
    templates: {
        id: string;
        name: string;
    }[];
    onAddTemplateTasks: (templateId: string) => void;
    linkToManageTemplates: string;
}
