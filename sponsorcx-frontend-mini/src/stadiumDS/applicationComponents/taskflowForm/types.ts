export interface GenericTaskUserInput {
    user_id: string;
    metadata?: Record<string, unknown>;
}

export type onUpdateAssignedUsers = (
    id: string | undefined,
    users: GenericTaskUserInput[]
) => void;
