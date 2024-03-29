import { ProjectInterface } from "@/common.types";
import { Modal, ProjectForm } from "@/components";
import { getProjectDetails } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";


const EditProject: React.FC<{params: {id: string}}> = async ({params: {id}}) => {
    const session = await getCurrentUser();

    if(!session?.user){
        redirect("/");
    }

    const result = await getProjectDetails(id) as {project?: ProjectInterface};


    return (
        <Modal>
            <h3 className="modal-head-text">Edit Project</h3>

            <ProjectForm type="edit" session={session} project={result?.project}/>
        </Modal>
    )
}

export default EditProject;