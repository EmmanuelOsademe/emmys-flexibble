"use client"

import { deleteProject, fetchToken } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface Props {
    projectId: string;
}

const ProjectActions: React.FC<Props> = ({projectId}) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeleteProject = async () => {
        setIsDeleting(true);

        const {token} = await fetchToken();

        try {
            await deleteProject(projectId, token);
            router.push("/")
        } catch (e: any) {
            console.log(e.message);
        }finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Link 
                href={`/edit/project/${projectId}`}
                className="flexCenter edit-action_btn"
            >
                <Image 
                    src={`/pencil.svg`}
                    width={15}
                    height={15}
                    alt="Edit"
                />
            </Link>
            <button
                type="button"
                className={`flexCenter delete-action_btn ${isDeleting ? 'bg-gray' : 'bg-blue-400'}`}
                onClick={handleDeleteProject}
            >
                <Image 
                    src={`/trash.svg`}
                    width={15}
                    height={15}
                    alt="Delete"
                />
            </button>
        </>
    )
}

export default ProjectActions;