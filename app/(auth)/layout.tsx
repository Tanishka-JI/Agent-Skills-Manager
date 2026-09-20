export default function AuthLAyout({
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <div className=" min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
            <div className=" card w-full max-w-md p-8 bg-amber-400 rounded shadow">
<div className="card-body"> {children} </div>
            </div>
        </div>
    )
}