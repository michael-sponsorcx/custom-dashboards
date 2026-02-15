import { StadiumToastProps } from '../StadiumToast';

export type StadiumVariantToastProps = Pick<
    StadiumToastProps,
    'message' | 'extraContent' | 'closeToast'
>;
