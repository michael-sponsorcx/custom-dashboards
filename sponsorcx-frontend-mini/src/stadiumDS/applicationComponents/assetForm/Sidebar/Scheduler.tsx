import { AssetFormBaseProps } from '../types';
import * as S from './Scheduler.styles';
import { Switch } from '@/stadiumDS/sharedComponents/Switch';

export const Scheduler = ({ asset, onUpdate }: AssetFormBaseProps) => {
    return (
        <S.Container>
            <Switch
                size="md"
                label="Enable Scheduler"
                checked={asset?.enable_scheduler}
                onChange={(event) =>
                    onUpdate(asset?.id, {
                        enable_scheduler: event.target.checked,
                    })
                }
            />
        </S.Container>
    );
};
