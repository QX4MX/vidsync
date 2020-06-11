export enum SocketEvent {
    CONNECT = "connection",
    DISCONNECT = "disconnect",
    UPDATE = 'update',
    JOIN = 'join',
    LEAVE = 'leave',
    MSG = 'msg',
    ALERT = 'alert',
    SET_USERNAME = 'setUserName',
    SET_VID = 'setId',
    LOAD_VID = 'loadId',
    PLAY = 'play',
    PAUSE = 'pause',
    STOP = 'stop',
    NEXT = 'next',
    FINISH = 'finish',
    ADD_TO_QUEUE = 'addToQ',
    RM_QUEUE_ELEM = 'removeQEl',
    PLAY_QUEUE_ELEM = 'playFromQ',
    LOAD_QUEUE = 'loadQueue',
    SYNCTIME = 'syncTime',
    SYNC_THIS = 'syncMe',
    SYNC_OTHER = 'syncClient',
    PUBLIC_ROOMS = 'publicRooms',
    GETUSERS = 'getUsers',
    GETROOMS = 'getRooms',
    DELROOM = 'deleteroom',
    DELUSER = 'deleteuser',
    searchYT = 'searchYoutube',
    RELATEDVIDS = 'relatedVids',
    playlistVideos = 'playlistVids',
    VIDSTATS = 'vidStats',
    BACKTOINDEX = 'errorRerouteToIndex',
    LOAD_RELATED = 'showrelated',
    ReadRoom = 'readroom',
}