import { createRef, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { X, AlertTriangle, HelpCircle, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner"; // or your preferred toast library
import { cn } from "@/lib/utils";

type TType = 'alert' | 'confirm' | 'danger' | 'info' | 'success';

type Options = {
    isToast?: boolean;
    visibilityTime?: number;
    text1?: string;
    text2?: string;
    moreContent?: React.ReactNode;
    footer?: React.ReactNode;
    onClose?: () => void;
    onClickBackdrop?: () => void;
    onClick?: () => void;
    showCloseButton?: boolean;

    primaryButtonText?: string;
    secondaryButtonText?: string;
    showPrimaryButton?: boolean;
    showSecondaryButton?: boolean;
    onClickPrimaryButton?: () => void;
    onClickSecondaryButton?: () => void;
    onClickCloseButton?: () => void;
    type: TType;
} & ({
    type: 'alert'
} | {
    type: 'confirm'
    onClickPrimaryButton: () => void | Promise<unknown>
} | {
    type: 'danger'
    onClickPrimaryButton: () => void | Promise<unknown>
} | {
    type: 'info'
} | {
    type: 'success'
})

interface GlobalModalRef {
    show(options: Options): void;
    isOpen: boolean;
    close: () => void;
}

const isAsync = (fn?: (() => void | Promise<unknown>)): boolean => {
    if (!fn) return false;
    return fn.constructor.name === 'AsyncFunction';
};

const ModalComponent = forwardRef<GlobalModalRef>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<Options>({
        type: 'alert',
    });

    const [primaryLoading, setPrimaryLoading] = useState(false);
    const [secondaryLoading, setSecondaryLoading] = useState(false);

    const {
        type,
        onClickPrimaryButton,
        onClickSecondaryButton,
        onClickCloseButton,
        onClickBackdrop,
        onClick,
        onClose,
        isToast,
        visibilityTime,
        text1,
        text2,
        moreContent,
        footer,
        showCloseButton = true,
        showPrimaryButton = true,
        showSecondaryButton = true,
        primaryButtonText,
        secondaryButtonText,
    } = options;

    const isPrimaryButtonAsync = isAsync(onClickPrimaryButton);
    const isSecondaryButtonAsync = isAsync(onClickSecondaryButton);

    const willShowPrimaryButton = showPrimaryButton;
    const willShowSecondaryButton = showSecondaryButton &&
        !(type === 'alert' || type === 'info' || type === 'success');

    useImperativeHandle(ref, () => ({
        show: (options: Options) => {
            console.log('show', options);

            if (options.isToast) {
                // Handle toast notifications
                const toastTexts = getTexts(options.type);
                const finalText1 = options.text1 || toastTexts.text1;
                const finalText2 = options.text2 || toastTexts.text2;

                const message = finalText2 ? `${finalText1}: ${finalText2}` : finalText1;

                if (options.type === 'success') {
                    toast.success(message);
                } else if (options.type === 'danger') {
                    toast.error(message);
                } else if (options.type === 'info') {
                    toast.info(message);
                } else {
                    toast(message);
                }
                return;
            }

            setOptions(options);
            setIsOpen(true);
        },
        isOpen,
        close: () => {
            setIsOpen(false);
            onClose?.();
        }
    }));

    const getTexts = (type: TType) => ({
        'alert': {
            text1: 'Uyarı',
            text2: '',
        },
        'confirm': {
            text1: 'Onayla',
            text2: 'Bunu onaylamak istediğinize emin misiniz?',
        },
        'danger': {
            text1: 'Uyarı',
            text2: 'Silmek istediğinize emin misiniz?',
        },
        'info': {
            text1: 'Bilgi',
            text2: '',
        },
        'success': {
            text1: 'İşlem Başarılı',
            text2: '',
        },
    }[type]);

    const texts = getTexts(type);
    const finalText1 = text1 || texts.text1;
    const finalText2 = text2 || texts.text2;

    const buttonTexts = {
        'alert': {
            primary: 'Tamam',
            secondary: 'Kapat',
        },
        'confirm': {
            primary: 'Onayla',
            secondary: 'İptal',
        },
        'danger': {
            primary: 'Sil',
            secondary: 'İptal',
        },
        'info': {
            primary: 'Tamam',
            secondary: 'Kapat',
        },
        'success': {
            primary: 'Tamam',
            secondary: 'Kapat',
        },
    }[type];

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    const handlePrimaryClick = async () => {
        if (isPrimaryButtonAsync) {
            setPrimaryLoading(true);
        }

        try {
            await onClickPrimaryButton?.();
        } finally {
            if (isPrimaryButtonAsync) {
                setPrimaryLoading(false);
            }
            handleClose();
        }
    };

    const handleSecondaryClick = async () => {
        if (isSecondaryButtonAsync) {
            setSecondaryLoading(true);
        }

        try {
            await onClickSecondaryButton?.();
        } finally {
            if (isSecondaryButtonAsync) {
                setSecondaryLoading(false);
            }
            handleClose();
        }
    };

    const renderIcon = () => {
        const iconSize = 76;
        const iconProps = { size: iconSize, className: "mx-auto mb-4" };

        switch (type) {
            case 'alert':
                return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-orange-600")} />;
            case 'confirm':
                return <HelpCircle {...iconProps} className={cn(iconProps.className, "text-primary")} />;
            case 'danger':
                return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-destructive")} />;
            case 'info':
                return <Info {...iconProps} className={cn(iconProps.className, "text-primary")} />;
            case 'success':
                return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-green-600")} />;
            default:
                return null;
        }
    };

    const getPrimaryButtonVariant = (type: TType) => {
        switch (type) {
            case 'alert':
            case 'info':
                return 'outline' as const;
            case 'danger':
                return 'destructive' as const;
            case 'confirm':
            case 'success':
            default:
                return 'default' as const;
        }
    };

    const getSecondaryButtonVariant = () => 'outline' as const;

    const renderFooter = () => {
        if (footer) {
            return footer;
        }

        return (
            <DialogFooter className="flex-row gap-3">
                {willShowSecondaryButton && (
                    <Button
                        variant={getSecondaryButtonVariant()}
                        onClick={handleSecondaryClick}
                        disabled={secondaryLoading || primaryLoading}
                        className="flex-1"
                    >
                        {secondaryLoading ? 'Loading...' : (secondaryButtonText || buttonTexts.secondary)}
                    </Button>
                )}
                {willShowPrimaryButton && (
                    <Button
                        variant={getPrimaryButtonVariant(type)}
                        onClick={handlePrimaryClick}
                        disabled={primaryLoading || secondaryLoading}
                        className="flex-1"
                    >
                        {primaryLoading ? 'Loading...' : (primaryButtonText || buttonTexts.primary)}
                    </Button>
                )}
            </DialogFooter>
        );
    };

    if (isToast) {
        return null;
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
        >
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-md"
                onClickOverlay={onClickBackdrop}

                //prevent close by clicking outside
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                {showCloseButton && (
                    <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={handleClose}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        disabled={primaryLoading || secondaryLoading}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                )}

                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {renderIcon()}
                    </div>
                    <DialogTitle className="text-center text-lg font-bold">
                        {finalText1}
                    </DialogTitle>
                    {finalText2 && (
                        <DialogDescription className="text-center text-sm">
                            {finalText2}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {moreContent && (
                    <div className="py-4">
                        {moreContent}
                    </div>
                )}

                {renderFooter()}
            </DialogContent>
        </Dialog>
    );
});

ModalComponent.displayName = "ModalComponent";

export const globalModalRef = createRef<GlobalModalRef>();

export const GlobalModalManager = {
    show: (options: Options) => {
        globalModalRef.current?.show(options);
    },
    close: () => {
        globalModalRef.current?.close();
    },
    get isOpen() {
        return globalModalRef.current?.isOpen ?? false;
    }
};

export const GlobalModal = () => {
    return <ModalComponent ref={globalModalRef} />;
};