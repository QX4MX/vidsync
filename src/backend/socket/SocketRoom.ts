export class SocketRoom {
    roomID: string;
    users: string[] = [];
    lastUsed: number;
    constructor(roomID: string) {
        this.roomID = roomID;
        this.lastUsed = Date.now();
    }

    getUsers() {
        return this.users;
    }

    getUserCount() {
        return this.users.length;
    }

    getLastUsed() {
        return this.lastUsed;
    }

    userJoin(socketID: string) {
        this.users.push(socketID);
    }

    userLeave(socketID: string) {
        if (this.users.includes(socketID)) {
            let index = this.users.indexOf(socketID);
            this.users.splice(index, 1);
        }
    }


}