import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production';

const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_URL || "" : "http://127.0.0.1:4000/graphql";
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || "" : "anykeyofyourchoice";
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000"

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables);
    } catch (e: any) {
        console.log(e.message);
        throw e;
    }
}

export const getUser = async (email: string) => {
    client.setHeader('x-api-key', apiKey)
    const user = await makeGraphQLRequest(getUserQuery, {email})
    return user;
}

export const createUser = (email: string, name: string, avaterUrl: string) => {
    const variables = {
        input: {
            name: name, 
            email: email,
            avaterUrl: avaterUrl
        }
    };
    client.setHeader('x-api-key', apiKey)
    return makeGraphQLRequest(createUserMutation, variables)
}

export const fetchToken = async () => {
    try {
        const res = await fetch(`${serverUrl}/api/auth/token`);
        return res.json();
    } catch (e: any) {
        console.log(e.message);
        throw e;
    }
}

export const uploadImage = async (imagePath: string) => {
    try {
        const res = await fetch(`${serverUrl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({path: imagePath})
        })

        return res.json();
    } catch (e: any) {
        console.log(e.message);
        throw e;
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {

    try {
        const imageUrl = await uploadImage(form.image) as UploadApiResponse | UploadApiErrorResponse;
        if(imageUrl.url){
            client.setHeader("Authorization", `Bearer ${token}`)
            const variables = {
                input: {
                    ...form,
                    image: imageUrl.url,
                    createdBy: {
                        link: creatorId
                    }
                }
            }
            
            return makeGraphQLRequest(createProjectMutation, variables);
        }
    } catch (e:any) {
        console.log(e.message);
        throw e;
    }
}

export const fetchAllProjects = (category?: string, endcursor?: string) => {
    client.setHeader('x-api-key', apiKey);

    const variables = {category, endcursor}

    return makeGraphQLRequest(projectsQuery, variables)
}

export const getProjectDetails = (id: string) => {
    client.setHeader('x-api-key', apiKey);

    return makeGraphQLRequest(getProjectByIdQuery, {id})
}

export const getUserProjects = (id: string, last?: number) => {
    client.setHeader('x-api-key', apiKey);
    
    return makeGraphQLRequest(getProjectsOfUserQuery, {id, last})
}

export const deleteProject = (id: string, token: string) => {
    client.setHeader("Authorization", `Bearer ${token}`);
    
    return makeGraphQLRequest(deleteProjectMutation, {id})
}

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
    function isBase64DataUrl(value: string){
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }

    let updatedForm = {
        ...form
    }

    const isUploadingNewImage = isBase64DataUrl(form.image);
    if(isUploadingNewImage){
        const imageUrl = await uploadImage(form.image) as UploadApiResponse | UploadApiErrorResponse;
        if(imageUrl.url){
            updatedForm = {
                ...form,
                image: imageUrl.url
            };
        }
    }
    
    client.setHeader("Authorization", `Bearer ${token}`);
    const variables = {
        id: projectId,
        input: updatedForm
    }
    
    return makeGraphQLRequest(updateProjectMutation, variables)
}