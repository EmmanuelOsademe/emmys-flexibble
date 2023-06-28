"use client";

import { ProjectInterface, SessionInterface } from "@/common.types";
import Image from "next/image";
import { Button, CustomMenu, FormField } from ".";
import { categoryFilters } from "@/constants";
import { useState } from "react";
import { ProjectForm } from "@/common.types";
import { createNewProject, fetchToken, updateProject } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
    type: "create" | "edit";
    session: SessionInterface;
    project?: ProjectInterface
}


const ProjectForm: React.FC<Props> =  ({type, session, project}) => {
    const router = useRouter();
    const [form, setForm] = useState<ProjectForm>({
        image: project?.image || "",
        title: project?.title || "",
        description: project?.description || "",
        liveSiteUrl: project?.liveSiteUrl || "",
        githubUrl: project?.githubUrl || "",
        category: project?.category || ""
    })
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const {token} = await fetchToken();
            

            if(type === "create"){
                await createNewProject(form, session?.user?.id, token);
                router.push("/");
            }

            if(type === "edit"){
                await updateProject(form, project?.id!, token);
                router.push("/");
            }
        } catch (e: any) {
            console.log(e.message);
        } finally{
            setIsSubmitting(false);
        }
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0];
        if(!file) return;
        if(!file.type.includes('image')){
            return alert('Please upload an image file')
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            handleStateChange('image', result)
        }
    }

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevState) => ({
            ...prevState, 
            [fieldName]: value
        }))
    }
   
    return (
        <form
            onSubmit={handleFormSubmit}
            className="flexStart form"
        >
            <div className="flexStart form_image-container">
                <label 
                    htmlFor="poster"
                    className="flexCenter form_image-label"
                >
                    {!form.image && "Choose a poster for your project"}
                    <input 
                        type="file"
                        id="image"
                        accept="image/*"
                        required={type === "create"}
                        className="form_image-input"
                        onChange={handleChangeImage}
                    />
                    {form.image && (
                        <Image 
                            src={form?.image}
                            className="sm:p-10 object-contain z-20"
                            alt="Project poster"
                            fill
                        />
                    )}
                </label>
            </div>
            <FormField 
                title="Title"
                state={form.title}
                placeholder="Flexxible"
                setState={(value) => handleStateChange('title', value)}
            />
            <FormField 
                title="Description"
                state={form.description}
                placeholder="Showcase and Discover remarkable developer projects"
                setState={(value) => handleStateChange('description', value)}
            />
            <FormField
                type="url" 
                title="Website URL"
                state={form.liveSiteUrl}
                placeholder="https://emmysdev.pro"
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />
            <FormField 
                type="url"
                title="Github Url"
                state={form.githubUrl}
                placeholder="https://github.com/emmanuel-osademe"
                setState={(value) => handleStateChange('githubUrl', value)}
            />
            
            <CustomMenu 
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />

            <div className="flexStart w-full">
                <Button 
                    title={isSubmitting ? `${type === "create" ? 'Creating' : "Editting"}` : `${type === "create" ? "Create" : "Edit"}`}
                    type="submit"
                    leftIcon={isSubmitting ? "" : "/plus.svg"}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    )
}

export default ProjectForm;