import { NextResponse, NextRequest } from "next/server"

const books = [
    { id: 1, name: "Book 1" },
    { id: 2, name: "Book 2" }
]

export const GET = async () => {
    return NextResponse.json(books)
}

export const POST = async (req: NextRequest) => {
    const { id, name } = await req.json()
    books.push({
        id, // id: id
        name // name: name
    })
    return NextResponse.json(books)
}

export const PUT = async (req: NextRequest) => {
    const { id, name } = await req.json()
    const bookId = books.find(b => b.id === id)

    if (bookId) {
        bookId.name = name
    }

    return NextResponse.json(books)
}

export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json()
    const removedBook = books.filter(b => b.id !== id)

    return NextResponse.json(removedBook)
}