import {
    BAssetStatus,
    BrandAsset,
    BrandAssetUpdateFields,
    deleteBrandAsset,
    getBrandAsset,
    getBrandAssetRequiredFieldsMet,
    updateBrandAsset,
} from '@/gql/brandAssetsGql';
import useStore from '@/state';
import { useMutation, useQuery } from '@apollo/client';
import { StadiumConfirmActionModal } from '@/stadiumDS/sharedComponents/ConfirmActionModal/StadiumConfirmActionModal';
import { useState } from 'react';
import { BrandAssetUserInput } from '@/gql/brandAssetUserGql';
import { refetchBrandAssetHistoryQueries } from '@/hooks/useBrandAssetHistory';
import { updateBAssetUsers } from '@/gql/brandAssetUserGql';
import { BAssetTask, updateBAssetTaskMutation } from '@/gql/bAssetTasksGql';
import { useUserStore } from '@/stores/userStore';
import { useSingleBrand } from '@/hooks/useSingleBrand';
import { FormSlideOut } from '../FormSlideOut/FormSlideOut';
import Trash from '@/stadiumDS/foundations/icons/General/Trash';
import { useBrandAssetTasks } from '@/hooks/useBrandAssetTasks';
import { brandAssetUploadsGql } from '@/gql/brandAssetUploadsGql';
import Eye from '@/stadiumDS/foundations/icons/General/Eye';
import EyeOff from '@/stadiumDS/foundations/icons/General/EyeOff';
import * as Content from './Content';
import * as Sidebar from './Sidebar';
import { Tooltip } from '@mantine/core';

interface AssetFormSlideOutProps {
    assetId?: BrandAsset['id'];
    highlightedTaskId?: BAssetTask['id'];
    setAssetId: (id: BrandAsset['id'] | undefined) => void;
    onUpdateComplete?: () => void;
    onUpdateUsersComplete?: () => void;
    onDeleteComplete?: () => void;
}

export const AssetFormSlideOut = ({
    assetId,
    highlightedTaskId,
    setAssetId,
    onUpdateComplete,
    onUpdateUsersComplete,
    onDeleteComplete,
}: AssetFormSlideOutProps) => {
    const [highlightRequiredFields, setHighlightRequiredFields] =
        useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const organization = useStore((state) => state.organization);

    const isBrandPartnerUser = useUserStore(
        (state) => state.isBrandPartnerUser
    );

    const [updateAsset] = useMutation(updateBrandAsset, {
        refetchQueries: refetchBrandAssetHistoryQueries,
        onCompleted: () => {
            onUpdateComplete?.();
            refetchActiveAsset();
        },
    });

    const handleUpdateAsset = async (
        id: string,
        fieldsToUpdate: Partial<BrandAssetUpdateFields>
    ) => {
        try {
            await updateAsset({
                variables: { id, ...fieldsToUpdate },
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error updating asset:', error, {
                id,
                fieldsToUpdate,
            });
        }
    };

    const [updateAssetUsers] = useMutation(updateBAssetUsers, {
        refetchQueries: refetchBrandAssetHistoryQueries,
        onCompleted: () => {
            refetchActiveAsset();
            onUpdateUsersComplete?.();
        },
    });

    const handleUpdateAssetUsers = async (
        b_asset_id: string,
        role: 'assigned' | 'follower',
        users: BrandAssetUserInput[]
    ) => {
        try {
            await updateAssetUsers({
                variables: { b_asset_id, users, role },
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error updating asset assigned users:', error, {
                b_asset_id,
                users,
            });
        }
    };

    const [deleteAsset] = useMutation(deleteBrandAsset);

    const handleDeleteAsset = async (id: string) => {
        try {
            await deleteAsset({
                variables: { organization_id: organization?.id, id },
                onCompleted: onDeleteComplete,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error deleting asset:', error, {
                id,
            });
        }
    };

    const { data: activeAssetData, refetch: refetchActiveAsset } = useQuery(
        getBrandAsset,
        {
            variables: {
                organization_id: organization?.id,
                id: assetId,
                isBrandPartnerUser,
            },
            skip: !assetId || !organization?.id,
        }
    );

    const asset = activeAssetData?.bAsset as BrandAsset;

    const { isSingleBrandOrg } = useSingleBrand();

    const handleClose = async () => {
        if (
            !getBrandAssetRequiredFieldsMet({
                asset: asset,
                isSingleBrandOrg,
            })
        ) {
            setConfirmationModalOpen(true);
            setHighlightRequiredFields(true);
            return;
        }
        // Slowdown closing the slideout so onUpdate can be called
        setTimeout(() => {
            setAssetId(undefined);
            setHighlightRequiredFields(false);
        }, 1);
    };

    const onUpdate = async (
        id: string | undefined,
        fieldsToUpdate: Partial<BrandAssetUpdateFields>
    ) => {
        if (!id) return;
        await handleUpdateAsset(id, fieldsToUpdate);
    };

    const isHiddenFromPartner = asset?.hide_in_partner_portal;
    const [confirmArchiveModalOpen, setConfirmArchiveModalOpen] = useState(false); // prettier-ignore
    const [hoveringUploadIds, setHoveringUploadIds] = useState<string[]>([]);
    const [completeTasksPopup, setCompleteTasksPopup] = useState(false);

    const brandAssetUploadsQuery = useQuery(brandAssetUploadsGql, {
        variables: {
            organization_id: asset?.organization_id,
            b_asset_id: asset?.id,
        },
        skip: !asset?.id,
    });

    const brandAssetUploads =
        brandAssetUploadsQuery.data?.brandAssetUploads ?? [];

    const { data: tasks, refetch: refetchTasks } = useBrandAssetTasks({
        bAssetId: asset?.id,
        skip: !asset,
        organizationId: asset?.organization_id,
    });

    const [updateTask] = useMutation(updateBAssetTaskMutation, {
        refetchQueries: refetchBrandAssetHistoryQueries,
    });

    return (
        <>
            <FormSlideOut
                isOpen={!!asset}
                onClose={handleClose}
                extraHeaderButtons={
                    !isBrandPartnerUser &&
                    isHiddenFromPartner && (
                        <Tooltip label="This asset is hidden from the partner portal">
                            <span>
                                <EyeOff size={'20'} />
                            </span>
                        </Tooltip>
                    )
                }
                threeDotMenuOptions={
                    isBrandPartnerUser
                        ? undefined
                        : [
                              {
                                  key: 'delete',
                                  label: 'Delete',
                                  onClick: () =>
                                      setConfirmArchiveModalOpen(true),
                                  icon: <Trash variant={'3'} />,
                              },
                              {
                                  key: 'toggle-hide-from-partner',
                                  label: isHiddenFromPartner
                                      ? 'Show in partner portal'
                                      : 'Hide from partner',
                                  onClick: () =>
                                      onUpdate(asset?.id, {
                                          hide_in_partner_portal:
                                              !asset?.hide_in_partner_portal,
                                      }),
                                  icon: isHiddenFromPartner ? (
                                      <Eye />
                                  ) : (
                                      <EyeOff />
                                  ),
                              },
                          ]
                }
                header={{
                    title: {
                        value: asset?.title ?? '',
                        placeholder: 'Asset Title...',
                        onUpdate: (value) =>
                            onUpdate(asset?.id, { title: value }),
                        disabled: isBrandPartnerUser,
                        highlightWhenEmpty: highlightRequiredFields,
                    },
                    description: {
                        value: asset?.description ?? '',
                        placeholder: 'Asset Description...',
                        onUpdate: (value) =>
                            onUpdate(asset?.id, { description: value }),
                        disabled: isBrandPartnerUser,
                    },
                }}
                tabs={[
                    {
                        key: 'overview',
                        label: 'Overview',
                        content: (
                            <>
                                <Content.Specs
                                    asset={asset}
                                    onUpdate={onUpdate}
                                    disabled={isBrandPartnerUser}
                                    brandAssetUploads={brandAssetUploads}
                                    refetchBrandAssetUploads={
                                        brandAssetUploadsQuery.refetch
                                    }
                                    hoveringUploadIds={hoveringUploadIds}
                                />
                                <Content.Tasks
                                    asset={asset}
                                    onUpdate={onUpdate}
                                    highlightedTaskId={highlightedTaskId}
                                    refetchBrandAssetUploads={
                                        brandAssetUploadsQuery.refetch
                                    }
                                    refetchBrandAssetTasks={refetchTasks}
                                    refetchBrandAsset={refetchActiveAsset}
                                    setHoveringUploadIds={setHoveringUploadIds}
                                    tasks={tasks}
                                />
                                <Content.AssetHistory asset={asset} />
                            </>
                        ),
                    },
                ]}
                sidePanelContent={
                    <>
                        <Sidebar.Fields
                            asset={asset}
                            onUpdate={async (id, fields) => {
                                await onUpdate(id, fields);
                                if (
                                    fields.status === BAssetStatus.COMPLETE &&
                                    tasks.some(
                                        (t: BAssetTask) =>
                                            t.status !== BAssetStatus.COMPLETE
                                    )
                                ) {
                                    setCompleteTasksPopup(true);
                                }
                            }}
                            onUpdateAssignedUsers={(id, users) => {
                                if (!id) return;
                                handleUpdateAssetUsers(id, 'assigned', users);
                            }}
                            highlightRequiredFields={highlightRequiredFields}
                            disabled={isBrandPartnerUser}
                        />
                        <Sidebar.Quantity
                            asset={asset}
                            onUpdate={onUpdate}
                            disabled={isBrandPartnerUser}
                        />
                        <Sidebar.DataFields
                            asset={asset}
                            onUpdate={onUpdate}
                            highlightRequiredFields={highlightRequiredFields}
                            disabled={isBrandPartnerUser}
                        />
                    </>
                }
            />
            <StadiumConfirmActionModal
                open={confirmArchiveModalOpen}
                onClose={() => setConfirmArchiveModalOpen(false)}
                onConfirm={() => {
                    onUpdate(asset?.id, { archived: true });
                    setConfirmArchiveModalOpen(false);
                }}
                title="Delete Asset?"
                description="Are you sure you want to delete this asset?"
                confirmButtonText="Delete"
                dangerConfirmButton
            />
            <StadiumConfirmActionModal
                open={completeTasksPopup}
                onClose={() => setCompleteTasksPopup(false)}
                onConfirm={async () => {
                    await Promise.all(
                        tasks
                            .filter(
                                (t: BAssetTask) =>
                                    t.status !== BAssetStatus.COMPLETE
                            )
                            .map((t: BAssetTask) =>
                                updateTask({
                                    variables: {
                                        id: t.id,
                                        organization_id: asset?.organization_id,
                                        status: BAssetStatus.COMPLETE,
                                    },
                                })
                            )
                    );
                    refetchTasks();
                    setCompleteTasksPopup(false);
                }}
                title="Asset complete"
                description="Do you want to update all task statuses to Complete?"
                confirmButtonText="Update"
                cancelButtonText="Cancel"
            />
            <StadiumConfirmActionModal
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={async () => {
                    await handleDeleteAsset(assetId!);
                    setConfirmationModalOpen(false);
                    setAssetId(undefined);
                    setHighlightRequiredFields(false);
                }}
                title="Missing required fields!"
                description="Please fill out required fields before exiting"
                confirmButtonText="Discard Asset"
                dangerConfirmButton
                cancelButtonText="Continue"
            />
        </>
    );
};
