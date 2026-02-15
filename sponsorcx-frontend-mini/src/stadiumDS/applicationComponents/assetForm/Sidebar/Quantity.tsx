import * as S from './Quantity.styles';
import { Text, TextSize, TextWeight } from '@/stadiumDS/foundations/text/Text';
import { primaryColors } from '@/stadiumDS/foundations/colors/primary';
import Eye from '@/stadiumDS/foundations/icons/General/Eye';
import { ActionIcon, Group, NumberInput, Tooltip } from '@mantine/core';
import { AssetFormBaseProps } from '../types';
import { AssetsFulfilledModal } from '../../AssetsFulfilledModal/AssetsFulfilledModal';
import { useState } from 'react';
import numberInputClasses from './QuantityNumberInput.module.css';
import { useBrandScheduledAssets } from '@/hooks/useBrandScheduledAssets';
import { SidePanelSection } from '../../FormSlideOut/components/SidePanelSection';
import { useHistory } from 'react-router-dom';
import colors from '@/stadiumDS/foundations/colors';
import { SidePanelAddFieldButton } from '../../FormSlideOut/components/SidePanelFields/SidePanelAddFieldButton';
import useFlagIsOn from '@/pages/internalPages/FeatureFlags/hooks/useFlagIsOn';
import FileCheck from '@/stadiumDS/foundations/icons/Files/FileCheck';

const FieldLabelText = ({ children }: { children: React.ReactNode }) => (
    <Text
        color={primaryColors.Gray[500]}
        size={TextSize.TextSm}
        weight={TextWeight.Regular}
    >
        {children}
    </Text>
);

const FieldValueText = ({ children }: { children: React.ReactNode }) => (
    <Text
        color={primaryColors.Gray[500]}
        size={TextSize.TextSm}
        weight={TextWeight.Regular}
    >
        {children}
    </Text>
);

export const Quantity = ({ asset, onUpdate, disabled }: AssetFormBaseProps) => {
    const [fulfilledPopoverOpen, setFulfilledPopoverOpen] = useState(false);
    const history = useHistory();
    const assetsFulfilledCustomFields = useFlagIsOn(
        'assets_fulfilled_custom_fields'
    );

    const { scheduledAssets, fulfilledCount, remainingCount } =
        useBrandScheduledAssets(asset);

    const handleViewClick = () => {
        if (!asset?.id || !asset?.fiscal_year_id) return;
        history.push(
            `/fulfillment/assets-fulfilled?b_asset_ids=${asset?.id}&fiscal_year_id=${asset?.fiscal_year_id}`
        );
    };

    const secondaryHeader =
        assetsFulfilledCustomFields && scheduledAssets.length > 0
            ? {
                  title: '',
                  info: undefined,
                  icon: (
                      <Group gap="8px">
                          <Tooltip label="Add fulfillment for asset">
                              <div>
                                  <SidePanelAddFieldButton
                                      onClick={() =>
                                          setFulfilledPopoverOpen(true)
                                      }
                                  />
                              </div>
                          </Tooltip>
                          <>
                              <span
                                  style={{
                                      color: colors.Gray[300],
                                      userSelect: 'none',
                                  }}
                              >
                                  |
                              </span>
                              <Tooltip label="View asset fulfillment history">
                                  <ActionIcon
                                      onClick={handleViewClick}
                                      style={{
                                          border: 'none',
                                          borderRadius: '16px',
                                          minWidth: '21px',
                                          minHeight: '21px',
                                          width: '21px',
                                          height: '21px',
                                      }}
                                  >
                                      <Eye size="14" color={colors.Gray[500]} />
                                  </ActionIcon>
                              </Tooltip>
                          </>
                      </Group>
                  ),
                  onClick: undefined,
              }
            : {
                  title: 'Fulfill',
                  info: 'Update the fulfilled quantity of this asset',
                  icon: <FileCheck size="16" variant="2" />,
                  onClick: () => setFulfilledPopoverOpen(true),
              };

    return (
        <SidePanelSection
            header={{
                title: 'Quantity',
                info: 'Quantity of the asset purchased within the budget year',
            }}
            secondaryHeader={disabled ? undefined : secondaryHeader}
        >
            <S.Field>
                <S.FieldLabel>
                    <FieldLabelText>Total</FieldLabelText>
                </S.FieldLabel>
                <S.FieldValue>
                    <NumberInput
                        value={asset?.quantity ?? 0}
                        onBlur={(e) => {
                            const value = Math.floor(Number(e.target.value));
                            if (value === asset?.quantity) return;
                            onUpdate(asset?.id, { quantity: value });
                        }}
                        classNames={numberInputClasses}
                        min={fulfilledCount || 1}
                        allowDecimal={false}
                        allowNegative={false}
                        clampBehavior="strict"
                        max={999}
                        disabled={disabled}
                    />
                </S.FieldValue>
            </S.Field>
            {scheduledAssets.length > 0 && (
                <>
                    <S.Field>
                        <S.FieldLabel>
                            <FieldLabelText>Fulfilled</FieldLabelText>
                        </S.FieldLabel>
                        <S.FieldValue>
                            <FieldValueText>{fulfilledCount}</FieldValueText>
                        </S.FieldValue>
                    </S.Field>

                    <S.Field>
                        <S.FieldLabel>
                            <FieldLabelText>Remaining</FieldLabelText>
                        </S.FieldLabel>
                        <S.FieldValue>
                            <FieldValueText>{remainingCount}</FieldValueText>
                        </S.FieldValue>
                    </S.Field>
                </>
            )}
            {disabled ? null : (
                <AssetsFulfilledModal
                    open={fulfilledPopoverOpen}
                    onClose={() => setFulfilledPopoverOpen(false)}
                    history={scheduledAssets}
                    totalAssets={asset?.quantity ?? 1}
                    brandAsset={asset}
                />
            )}
        </SidePanelSection>
    );
};
