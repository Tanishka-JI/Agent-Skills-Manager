import Link from "next/link"

export default function notFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Skill Not Found</h1>
            <p className="text-lg text-gray-600">The skill you are looking for does not exist.</p>
            <Link href={'/'} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                Go Back to Home
            </Link>
        </div>
    )
}