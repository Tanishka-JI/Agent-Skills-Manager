 export type Skill={
    id:string;
    name:string;
    description:string;
    category:string;
    createdAt:string;
    updatedAt:string;
};
export let SKILLS:Skill[]=[
    {
        id:"1",
        name:"Skill 1",
        description:"This is the first skill",
        category:"Category 1",
        createdAt:"2023-01-01T00:00:00Z",
        updatedAt:"2023-01-01T00:00:00Z" 
    },
    {
        id:"2",
        name:"Skill 2",
        description:"This is the second skill",
        category:"Category 2",
        createdAt:"2023-01-01T00:00:00Z",
        updatedAt:"2023-01-01T00:00:00Z"
    }
];

export async function getSkill(){
    await new Promise((resolve)=>setTimeout(resolve,3000))
    return [...SKILLS]
}

export async function addSkill(skill:Skill){
  await new Promise((resolve)=>setTimeout(resolve,3000))
    SKILLS=[...SKILLS,skill]
    return getSkill()
}