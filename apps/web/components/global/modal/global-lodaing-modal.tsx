"use client"
import { tryCatch } from "@repo/shared/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { createRef, useEffect, useImperativeHandle, useState } from "react";
// import { tryCatch } from "zod";
// import { PROMISE_VERSION } from "next/dist/shared/lib/constants";

let PROMISE_VERSION = 0;

interface LoadingModalRef {
    show: (options?: { moreContent?: React.ReactElement }) => void;
    queuePromise: (promises: Promise<any>[]) => Promise<void>;
    close: () => void;
    isOpen: boolean;
    isInitialized: boolean;
}

const LoadingModal = ({ ref }: { ref: React.RefObject<LoadingModalRef | null> }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [moreContent, setMoreContent] = useState<React.ReactElement | null>(null);
    const [activePromises, setActivePromises] = useState<Promise<any>[]>([]);

    useImperativeHandle(ref, () => {
        return ({
            show: (options?: { moreContent?: React.ReactElement }) => {
                setMoreContent(options?.moreContent || null);
                setIsVisible(true);
            },
            queuePromise: async (promises: Promise<any>[]) => {

                const newPromises = promises.filter(p => !activePromises.includes(p));

                if (newPromises.length === 0) {
                    return;
                }

                setActivePromises(prevPromises => {
                    const newPromises = promises.filter(p => !prevPromises.includes(p));
                    return [...prevPromises, ...newPromises];
                });
                setIsVisible(true);
                let version = PROMISE_VERSION;
                await tryCatch(Promise.all(promises))
                // if (version !== PROMISE_VERSION) {
                //     return;
                // }
                setActivePromises(prevPromises =>
                    prevPromises.filter(p => !promises.includes(p))
                );
                if (activePromises.length === 0) {
                    setIsVisible(false);
                    setMoreContent(null);
                }

            },
            close: () => {
                if (activePromises.length === 0) {
                    setIsVisible(false);
                    setMoreContent(null);
                }
            },
            get isOpen() {
                return isVisible;
            },
            isInitialized: true,
        })
    });




    return <Dialog
        open={isVisible} onOpenChange={setIsVisible}>
        <DialogContent
            showCloseButton={false}
            className="size-14 p-0 flex items-center justify-center bg-transparent"
            overlayClassName={'bg-gray-500/30'}

            //prevent close by clicking outside
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
        >
            <Loader className="size-10 animate-spin" />
        </DialogContent>
    </Dialog>
}


const loadingRef = createRef<LoadingModalRef>();

export const LoadingManager = {
    show: (options?: { moreContent?: React.ReactElement }) => {
        loadingRef.current?.show(options);
    },
    queuePromise: (promises: Promise<any>[]) => {
        console.log('queuePromise2323', promises)
        console.log('loadingRef.current', loadingRef.current)
        return loadingRef.current?.queuePromise(promises);
    },
    close: () => {
        loadingRef.current?.close();
    },
    get isOpen() {
        return loadingRef.current?.isOpen ?? false;
    },
    get isInitialized() {
        return loadingRef.current?.isInitialized ?? false;
    },
};


export const GlobalLoadingModal = () => {
    return <LoadingModal ref={loadingRef} />

}



export const useSingleLoadingModal = (promise: Promise<unknown>) => {


    useEffect(() => {
        LoadingManager.queuePromise([promise])
    }, [promise])

}


export const useMultipleLoadingModal = (promises: Promise<unknown>[]) => {
    useEffect(() => {
        LoadingManager.queuePromise(promises)
        // LoadingManager.queuePromise(promises)
    }, [promises])
}