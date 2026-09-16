import{ NextRequest, NextResponse } from "next/server";
export async function POST(request:NextRequest){
    const {email,password }=await request.json();
    if(email!=="admin" || password!=="admin"){
        return NextResponse.json({message:"Invalid credentials"},{status:401})
    }

    const response=NextResponse.json({
        message:"Login successful",
    user:{id:"1",name:"Admin"}
    });
    return response;
}