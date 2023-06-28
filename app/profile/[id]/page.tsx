
import { UserProfile } from "@/common.types";
import { ProfilePage } from "@/components";
import { getUserProjects } from "@/lib/actions";

interface Props {
    params: {
        id: string;
    }
}

const UserProfile: React.FC<Props> = async ({params: {id}}) => {
    const result = await getUserProjects(id, 100) as {user?: UserProfile};
    
    if(!result?.user){
        return (
            <p className="no-result-text">Failed to fetch user info</p>
        )
    }

    return (
        <ProfilePage user={result?.user}/>
    )
}

export default UserProfile;