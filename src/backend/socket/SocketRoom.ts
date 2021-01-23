export class SocketRoom {
    roomID: string;
    users: string[][] = [];
    lastUsed: number;
    constructor(roomID: string) {
        this.roomID = roomID;
        this.lastUsed = Date.now();
    }

    getUsers() {
        return this.users;
    }
    getUsernames() {
        let usernames: string[] = [];
        for (let user of this.users) {
            usernames.push(user[1]);
        }
        return usernames;
    }

    getUserCount() {
        return this.users.length;
    }

    getLastUsed() {
        return this.lastUsed;
    }

    userJoin(socketID: string, username: string) {
        if (!this.users.includes([socketID, username])) {
            this.users.push([socketID, username]);
        }
    }

    userLeave(socketID: string) {
        let index = 0;
        for (let user of this.users) {
            if (user[0] == socketID) {
                this.users.splice(index, 1);
            }
            index++;
        }
    }
}