"use client";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const wrapperVariants = cva("mx-auto w-full px-2.5 sm:px-6 lg:px-8 max-w-7xl",
    {
        variants: {
            variant: {
                default: {
                    className: "max-w-7xl"
                },
                widest: {
                    className: "max-w-8xl"
                }

            }
        },
        defaultVariants: {
            variant: "default",
        }
    });


function MaxWidthWrapper({
    children,
    className,
    variant = "default",
    ...props
}: {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>
    & VariantProps<typeof wrapperVariants>) {
    return (
        <div {...props} className={cn(wrapperVariants({ variant }), className)}>
            {children}
        </div>
    );
}



export default MaxWidthWrapper;
