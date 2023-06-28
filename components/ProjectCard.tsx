"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


interface Props {
id: string;
image: string;
title: string;
name: string;
avaterUrl: string;
userId: string;
}

const ProjectCard: React.FC<Props> = ({id, image, title, name, avaterUrl, userId}) => {
    const [randomLikes, setRandomLike] = useState<number>(0);
    const [randomViews, setRandomViews] = useState<string>("");

    useEffect(() => {
        setRandomLike(Math.floor(Math.random() * 1000));
        setRandomViews(String((Math.floor(Math.random() * 10000)/1000).toFixed(1))+ 'k')
    }, [])
    return (
        <div className="flexCenter flex-col rounded-2xl drop-shadow-card">
            <Link 
                href={`/project/${id}`}
                className="flexCenter group relative w-full h-full"
            >
                <Image 
                    src={image}
                    width={414}
                    height={314}
                    className="w-full h-full object-cover rounded-2xl"
                    alt="Project image"
                />

                <div className="hidden group-hover:flex profile_card-title">
                    <p className="w-full">{title}</p>
                </div>
            </Link>
            <div className="flexBetween w-full px-2 mt-3 font-semibold text-sm">
                <Link
                    href={`profile/${userId}`}
                >
                    <div className="flexCenter gap-2">
                        <Image 
                            src={avaterUrl}
                            width={24}
                            height={24}
                            className="rounded-full"
                            alt="Profile image"
                        />
                        <p>{name}</p>
                    </div>
                </Link>
                <div className="flexCenter gap-3">
                    <div className="flexCenter gap-2">
                        <Image 
                            src={`/heart.svg`}
                            width={13}
                            height={12}
                            alt="Heart"
                            className=""
                        />
                        <p className="text-sm">{randomLikes}</p>
                    </div>
                    <div className="flexCenter gap-2">
                        <Image 
                            src={`/eye.svg`}
                            width={13}
                            height={12}
                            alt="Eye"
                            className=""
                        />
                        <p className="text-sm">{randomViews}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;