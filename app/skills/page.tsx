import Link from "next/link";
import  { getSkill } from "./SKILLS";
export default async function SkillsPage() {

    const skills=await getSkill()

  return <section>
    <h1> Skills</h1>
    <Link href="/skills/create">Create Skill</Link>
    <ul>
      {skills.map((skill) => (
        <li key={skill.id}>
            <Link href={`/skills/${skill.id}`}>{skill.name}</Link>
        </li>
      ))}
    </ul>   
  </section>
}