"use client"

import { MouseEventHandler } from "react";
import Image from "next/image";

interface Props {
    title: string;
    leftIcon?: string | null;
    rightIcon?: string | null;
    handleClick?: MouseEventHandler;
    isSubmitting?: boolean;
    type?: "button" | "submit";
    bgColor?: string;
    textColor?: string;
    fontStyle?: string
}

const Button: React.FC<Props> = ({title, leftIcon, rightIcon, handleClick, isSubmitting, type, bgColor, textColor, fontStyle}) => {

    return (
        <button 
            className={
                `flexCenter gap-4 px-4 py-3 rounded-xl text-sm md:w-full cursor-pointer
                ${isSubmitting ? "opacity-50 bg-black/50" : bgColor || "bg-blue-600"}
                ${textColor || "text-white"}
                ${fontStyle || "font-medium"}`
            }
            type={type}
            disabled={isSubmitting}
            onClick={handleClick}
        >
            {leftIcon && (
                <Image
                    src={leftIcon}
                    width={14}
                    height={14}
                    alt="left"
                />
            )}
            {title}
            {rightIcon && (
                <Image
                    src={rightIcon}
                    width={14}
                    height={14}
                    alt="right"
                />
            )}
        </button>
    )
}

export default Button;