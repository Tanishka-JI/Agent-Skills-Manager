
import { getSkill } from "../SKILLS";
import {notFound} from "next/navigation";


export default async function SkillsPage({ params }: { params: { id: string } }) {
 
  const skills=await getSkill()
  const {id}=await params
const skill=skills.find((skill)=>skill.id===id)
if(!skill){
  return notFound()
}
  return <article>
      <h1>{skill.name}</h1>
      <p>{skill.description}</p>
      <p>{skill.category}</p>
      <p> {skill.createdAt}</p>
      <p> {skill.updatedAt}</p>
    </article>
  

}