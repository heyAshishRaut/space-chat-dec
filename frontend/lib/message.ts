export type Message = {
    id: string
    firstName: string
    email: string
    type: "text" | "image" | "file"
    file: string | null
    text: string | null
    likes: number
    likedByMe: boolean
    spaceId: string | null
    createdAt: string
}