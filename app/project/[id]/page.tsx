import { ProjectInterface } from "@/common.types";
import { Modal, ProjectActions, RelatedProjects } from "@/components";
import { getProjectDetails } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session"
import Image from "next/image";
import Link from "next/link";


const ProjectDetails: React.FC<{params: {id: string}}> = async ({params: {id}}) => {
    const session = await getCurrentUser();

    const result = await getProjectDetails(id) as {project?: ProjectInterface}
    
    if(!result?.project){
        <p className="no-result-text">Failed to fetch project information</p>
    }

    const projectDetail = result?.project;

    const renderLink = () => `/profile/${projectDetail?.createdBy?.id}`
    
    
    return (
        <Modal>
            <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
                <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
                    <Link href={renderLink()}>
                        <Image 
                            src={projectDetail?.createdBy?.avaterUrl!}
                            width={50}
                            height={50}
                            alt="Profile"
                            className="rounded-full cursor-pointer"
                        />
                    </Link>
                    <div className="flex-1 flexStart flex-col gap-1">
                        <p className="self-start text-lg font-semibold">
                            {projectDetail?.title}
                        </p>
                        <div className="user-info">
                            <Link href={renderLink()}>
                                {projectDetail?.createdBy?.name}
                            </Link>
                            <Image 
                                src={'/dot.svg'}
                                width={4}
                                height={4}
                                alt="dot"
                            />
                            <Link 
                                href={`?category=${projectDetail?.category}`}
                                className="text-primary-purple font-semibold"
                            >
                                {projectDetail?.category}
                            </Link>
                        </div>
                    </div>
                </div>
                {session?.user?.email === projectDetail?.createdBy?.email && (
                    <div className="flex justify-end items-center gap-2">
                        <ProjectActions projectId={projectDetail?.id!}/>
                    </div>
                )}
            </section>
            <section className="mt-14">
                <Image 
                    src={projectDetail?.image!}
                    className="object-cover rounded-2xl drop-shadow-2xl"
                    width={1064}
                    height={798}
                    alt="Poster"
                />
            </section>
            <section className="flexCenter flex-col mt-20">
                <p className="max-w-5xl text-xl font-normal">
                    {projectDetail?.description}
                </p>
                <div className="flex flex-wrap mt-5 gap-5">
                    <Link 
                        href={projectDetail?.githubUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="flexCenter gap-2 text-sm font-medium text-primary-purple cursor-pointer"
                    >
                        <span className="underline">Github</span>
                    </Link>
                    <Image src={'/dot.svg'} width={4} height={4} alt="dot"/>
                    <Link 
                        href={projectDetail?.liveSiteUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="flexCenter gap-2 text-sm font-medium text-primary-purple cursor-pointer"
                    >
                        <span className="underline">Live Site</span>
                    </Link>
                </div>
            </section>
            <section className="flexCenter w-full gap-8 mt-28">
                <span className="w-full h-0.5 bg-light-white-200"/>
                <Link
                    href={renderLink()}
                    className="min-w-[28px] h-[82px]"
                >
                    <Image 
                        src={projectDetail?.createdBy?.avaterUrl!}
                        width={82}
                        height={82}
                        alt="Profile image"
                        className="rounded-full"
                    />
                </Link>
                <span className="w-full h-0.5 bg-light-white-200"/>
            </section>
            <RelatedProjects  userId={projectDetail?.createdBy?.id!} projectId={projectDetail?.id!}/>
        </Modal>
    )
}

export default ProjectDetails