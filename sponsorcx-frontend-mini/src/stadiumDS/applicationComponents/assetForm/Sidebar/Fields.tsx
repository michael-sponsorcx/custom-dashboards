import { cloneElement } from 'react';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import Currency from '@/stadiumDS/foundations/icons/Finance/Currency';
import Building from '@/stadiumDS/foundations/icons/General/Building';
import { BAssetStatus } from '@/gql/brandAssetsGql';
import { liveMemoStatusIcons } from '@/pages/brandPages/LiveMemo/components/LiveMemoStatusIndicator/LiveMemoStatusIndicator';
import { AssetFormBaseProps, onUpdateAssignedUsers } from '../types';
import { useBrandPropertyOptionsOld } from '@/hooks/useBrandPropertyOptions';
import { ComboboxItem } from '@mantine/core';
import useBrandPropertyFromUrl from '@/hooks/useBrandPropertyFromUrl';
import { useFiscalYearStore } from '@/stores/fiscalYearStore';
import { useSingleBrand } from '@/hooks/useSingleBrand';
import { SidePanelFieldsSection } from '../../FormSlideOut/components/SidePanelFieldsSection';
import { SidePanelSelectOptionImage } from '../../FormSlideOut/components/SidePanelFields/SidePanelSelectOptionImage';
import {
    sidePanelLabelIconSize,
    SidePanelFieldTypes,
    SidePanelFieldProps,
} from '../../FormSlideOut/components/SidePanelFields/SidePanelFields.types';

export interface FieldsProps extends AssetFormBaseProps {
    onUpdateAssignedUsers: onUpdateAssignedUsers;
    highlightRequiredFields?: boolean;
}

export const Fields = ({
    asset,
    onUpdate,
    onUpdateAssignedUsers,
    highlightRequiredFields,
    disabled,
}: FieldsProps) => {
    const propertyOptions = useBrandPropertyOptionsOld();
    const { fiscalYearOptions } = useFiscalYearStore();
    const { brandPropertyFromUrl } = useBrandPropertyFromUrl();
    const { isSingleBrandOrg } = useSingleBrand();

    const assigneeUserIds =
        asset?.assigned_users
            ?.filter((au) => au.user_id)
            .map((au) => au.user_id as string) ?? [];

    const overdue = asset?.tags?.overdue;

    const fields: SidePanelFieldProps[] = [
        {
            type: SidePanelFieldTypes.SELECT,
            label: 'Status',
            onChange: (value) => {
                if (!value) return;
                onUpdate(asset?.id, { status: value as BAssetStatus });
            },
            options: Object.entries(liveMemoStatusIcons).map(
                ([key, value]) => ({
                    value: key,
                    label: value.name,
                    leftSection: cloneElement(value.component, {
                        size: String(sidePanelLabelIconSize),
                    }),
                })
            ),
            disabled,
            value: asset?.status,
        },
        {
            type: SidePanelFieldTypes.DATE,
            label: 'Due Date',
            onChange: (date) => {
                onUpdate(asset?.id, {
                    due_at: date,
                });
            },
            disabled,
            value: asset?.due_at,
            overdue,
        },
        {
            type: SidePanelFieldTypes.SELECT,
            label: 'Budget Year',
            icon: (
                <Currency
                    color={primaryColors.Gray[500]}
                    size={String(sidePanelLabelIconSize)}
                    variant="dollar-circle"
                />
            ),
            onChange: (value: string | null) => {
                if (!value) return;
                onUpdate(asset?.id, {
                    fiscal_year_id: value,
                });
            },
            options: fiscalYearOptions.map((option) => ({
                value: (option as ComboboxItem).value,
                label: (option as ComboboxItem).label,
            })),
            disabled,
            value: asset?.fiscal_year_id,
        },
        {
            type: SidePanelFieldTypes.USER_MULTI_SELECT,
            label: 'Assignees',
            onChange: (userIds) => {
                onUpdateAssignedUsers(
                    asset?.id,
                    userIds.map((au) => ({
                        user_id: au,
                    }))
                );
            },
            value: assigneeUserIds,
            disabled,
        },
        {
            type: SidePanelFieldTypes.SELECT,
            label: 'Property',
            icon: (
                <Building
                    color={primaryColors.Gray[500]}
                    size={String(sidePanelLabelIconSize)}
                    variant="6"
                />
            ),
            onChange: (value: string | null) => {
                if (!value) return;
                onUpdate(asset?.id, {
                    b_property_id: value,
                });
            },
            options: propertyOptions.map((option) => ({
                value: option.value,
                label: option.text,
                image: option.logo as string | undefined,
                leftSection: (
                    <SidePanelSelectOptionImage
                        image={option.logo as string | undefined}
                        fallback={
                            <Building
                                variant="6"
                                size={String(sidePanelLabelIconSize)}
                                color={primaryColors.Gray[500]}
                            />
                        }
                    />
                ),
            })),
            value: asset?.b_property_id,
            disabled: !!brandPropertyFromUrl || disabled,
            required: true,
            highlightRequiredFields,
        },
        // Conditionally add Brand field
        ...(!isSingleBrandOrg
            ? [
                  {
                      type: SidePanelFieldTypes.SELECT as const,
                      label: 'Brand',
                      icon: (
                          <Building
                              color={primaryColors.Gray[500]}
                              size={String(sidePanelLabelIconSize)}
                              variant="1"
                          />
                      ),
                      onChange: (value: string | null) => {
                          if (!value) return;
                          onUpdate(asset?.id, {
                              b_brand_id: value,
                          });
                      },
                      options: (
                          asset?.brand_property_with_brand_rels?.brand_rels ??
                          []
                      )
                          .filter(
                              (option) =>
                                  option.brand != null && option.brand_id
                          )
                          .map((option) => ({
                              value: option.brand_id,
                              label: option.brand?.name ?? '',
                          })),
                      value: asset?.b_brand_id,
                      disabled,
                      required: true,
                      highlightRequiredFields,
                  },
              ]
            : []),
    ];

    return <SidePanelFieldsSection fields={fields} />;
};
