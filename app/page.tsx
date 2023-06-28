import { ProjectInterface } from "@/common.types";
import { Categories, LoadMore, ProjectCard } from "@/components";
import { fetchAllProjects } from "@/lib/actions";

interface ProjectSearch {
    projectSearch: {
        edges: {
            node: ProjectInterface
        }[];
        pageInfo: {
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor: string;
            endCursor: string;
        }
    }
}

interface SearchParams  {
    category?: string;
    endcursor?: string;
}

interface Props {
    searchParams: SearchParams
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const Home: React.FC<Props> = async ({searchParams: {category, endcursor}}) => {
    const projects = await fetchAllProjects(category, endcursor) as ProjectSearch;
    const projectsToDisplay = projects?.projectSearch?.edges || [];
    if(projectsToDisplay.length === 0){
        return (
            <section className="flexStart flex-col paddings">
                <Categories />
                <p className="no-result-text text-center">No projects found, go create some first</p>
            </section>
        )
    }

    const pagination = projects?.projectSearch?.pageInfo;

    return (
        <section className="flex-start flex-col paddings mb-16">
            <Categories />
            <section className="projects-grid">
                {projectsToDisplay.map(({node}: {node: ProjectInterface}) => (
                    <ProjectCard 
                        key={node?.id}
                        id={node?.id}
                        image={node?.image}
                        title={node?.title}
                        name={node?.createdBy?.name}
                        avaterUrl={node?.createdBy?.avaterUrl}
                        userId={node?.createdBy?.id}
                    />
                ))}
            </section>
            <LoadMore 
                startCursor={pagination?.startCursor}
                endCursor={pagination?.endCursor}
                hasPreviousPage={pagination?.hasPreviousPage}
                hasNextPage={pagination?.hasNextPage}
            />
        </section>
    )
}

export default Home;