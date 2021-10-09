export class Room {
    id: string
    name: string
    video: string[]
    userCount: number
    queue: Array<string[]>
    history: Array<string[]>
    creator: string
    created_date: Date
}

