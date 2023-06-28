export const getUserQuery = `
    query GetUser($email: String!){
        user(by: {email: $email}){
            id
            name
            email
            avaterUrl
            description
            githubUrl
            linkedInUrl
        }
    }
`

export const createUserMutation = `
    mutation CreateUser($input: UserCreateInput!){
        userCreate(input: $input){
            user {
                name
                email
                avaterUrl
                description
                linkedInUrl
                githubUrl
                id
            }
        }
    }
`

export const createProjectMutation = `
	mutation CreateProject($input: ProjectCreateInput!) {
		projectCreate(input: $input) {
			project {
				id
				title
				description
				createdBy {
					email
					name
				}
			}
		}
	}
`;

export const projectsQuery = `
    query getProjects($category: String, $endcursor: String){
        projectSearch(first: 8, after: $endcursor, filter: {category: {eq: $category}}){
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node {
                    title
                    githubUrl
                    description
                    liveSiteUrl
                    id
                    image
                    category
                    createdBy {
                        id
                        email
                        name
                        avaterUrl
                    }
                }
            }
        }
    }
`;

export const getProjectByIdQuery = `
    query GetProjectById($id: ID!){
        project(by: {id: $id}){
            id
            title
            description
            image
            liveSiteUrl
            githubUrl
            category
            createdBy {
                id
                name
                email
                avaterUrl
            }
        }
    }
`

export const getProjectsOfUserQuery = `
    query getUserProjects($id: ID!, $last: Int = 4) {
        user(by: {id: $id}){
            id
            name
            email
            description
            avaterUrl
            githubUrl
            linkedInUrl
            projects(last: $last){
                edges {
                    node {
                        id
                        title
                        image
                    }
                }
            }
        }
    }
`

export const deleteProjectMutation  = `
    mutation DeleteProject($id: ID!) {
        projectDelete(by: {id: $id}){
            deletedId
        }
    }
`

export const updateProjectMutation = `
    mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!){
        projectUpdate(by: {id: $id}, input: $input){
            project {
                id
                title
                description
                createdBy {
                    email
                    name
                }
            }
        }
    }
`