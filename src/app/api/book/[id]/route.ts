import { NextResponse, NextRequest } from "next/server"

const books = [
    { id: 1, name: "Book 1" },
    { id: 2, name: "Book 2" }
]

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { name } = await req.json()
    const { id } = await params

    const bookId = books.find(b => b.id === parseInt(id))

    if (bookId) {
        bookId.name = name
    }

    return NextResponse.json(books)
}

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params
        const bookId = books.find(b => b.id === parseInt(id))

        if (!bookId) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 })
        }

        return NextResponse.json(bookId)
    } catch (error) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}