import { toast, ToastOptions } from 'react-toastify';
import { StadiumErrorToast } from './Variants/StadiumErrorToast';
import { StadiumSuccessToast } from './Variants/StadiumSuccessToast';
import { StadiumWarningToast } from './Variants/StadiumWarningToast';
import { StadiumInfoToast } from './Variants/StadiumInfoToast';
import { ReactNode } from 'react';

const toastConfig: ToastOptions = {
    hideProgressBar: true,
    closeOnClick: false,
    style: {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
    },
    closeButton: false,
    autoClose: 3000,
};

export const stadiumToast = {
    update: toast.update,
    dismiss: toast.dismiss,
    isActive: toast.isActive,
    success: (
        message: ReactNode,
        options?: ToastOptions,
        extraContent?: (closeToast: () => void) => JSX.Element
    ) =>
        toast(
            <StadiumSuccessToast
                message={message}
                closeToast={() => toast.dismiss()}
                extraContent={
                    extraContent ? extraContent(toast.dismiss) : undefined
                }
            />,
            {
                ...toastConfig,
                ...options,
            }
        ),
    warning: (
        message: ReactNode,
        options?: ToastOptions,
        extraContent?: (closeToast: () => void) => JSX.Element
    ) =>
        toast(
            <StadiumWarningToast
                message={message}
                closeToast={() => toast.dismiss()}
                extraContent={
                    extraContent ? extraContent(toast.dismiss) : undefined
                }
            />,
            {
                ...toastConfig,
                ...options,
            }
        ),
    error: (
        message: ReactNode,
        options?: ToastOptions,
        extraContent?: (closeToast: () => void) => JSX.Element
    ) =>
        toast(
            <StadiumErrorToast
                message={message}
                closeToast={() => toast.dismiss()}
                extraContent={
                    extraContent ? extraContent(toast.dismiss) : undefined
                }
            />,
            {
                ...toastConfig,
                ...options,
            }
        ),
    info: (
        message: ReactNode,
        options?: ToastOptions,
        extraContent?: (closeToast: () => void) => JSX.Element
    ) =>
        toast(
            <StadiumInfoToast
                message={message}
                closeToast={() => toast.dismiss()}
                extraContent={
                    extraContent ? extraContent(toast.dismiss) : undefined
                }
            />,
            {
                ...toastConfig,
                ...options,
            }
        ),
};
