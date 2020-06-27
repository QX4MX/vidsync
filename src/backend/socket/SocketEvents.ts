export enum SocketEvent {
    CONNECT = "connection",
    DISCONNECT = "disconnect",
    JOIN = 'join',
    LEAVE = 'leave',
    PLAY = 'play',
    PAUSE = 'pause',
    NEXT = 'next',
    SET_VID = 'setId',
    LOAD_VID = 'loadId',
    SYNCTIME = 'syncTime',
    UPDATEROOM = 'updateRoom',
    MSG = 'msg',
    YTSEARCH = 'searchYoutube',
    YTGETPLAYLIST = 'playlistVids',
    GETUSERCOUNT = 'getUsers',
    GETACTIVEROOMS = 'getActiveRooms'
}