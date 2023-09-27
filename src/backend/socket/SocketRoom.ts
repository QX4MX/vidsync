/**
 * SocketRoom class to store room information
 */
export class SocketRoom {
    roomID: string;
    users: string[][] = [];
    lastUsed: number;

    /**
     * Creates a SocketRoom
     * @param roomID
     */
    constructor(roomID: string) {
        this.roomID = roomID;
        this.lastUsed = Date.now();
    }

    /**
     * @returns RoomID
     */
    getUsers() {
        return this.users;
    }

    /**
     * @returns usernames
     */
    getUsernames() {
        let usernames: string[] = [];
        for (let user of this.users) {
            usernames.push(user[1]);
        }
        return usernames;
    }

    /**
     * @returns number of users
     */
    getUserCount() {
        return this.users.length;
    }

    /**
     * @returns lastUsed
     */
    getLastUsed() {
        return this.lastUsed;
    }

    /**
     * Adds a user to the room
     * @returns
     */
    userJoin(socketID: string, username: string) {
        if (!this.users.includes([socketID, username])) {
            this.users.push([socketID, username]);
        }
    }

    /**
     * Removes a user from the room
     * @returns
     */
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
