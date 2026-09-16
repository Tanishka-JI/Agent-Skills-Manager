"use client"
import{useActionState} from "react"
import{createSkill} from "@/app/action/skills"

const initialState={
    message:""
}

export default function NEWSkillPage(){
    const [state, formAction,pending] = useActionState(createSkill, initialState);
    return (
        <form action={formAction}>
            <input type="text" name="name" placeholder="Skill Name" />
            <textarea name="description" placeholder="Description" />
            <input type="text" name="category" placeholder="Category" />
            <p aria-live="polite">{state.message}</p>
            <button type="submit" disabled={pending}>
                 {pending ? "Creating..." : "Create Skill"}
            </button>
        </form>
    );
}