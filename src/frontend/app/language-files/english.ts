import { Language } from '../services/language.service';
export class EnglishLanguage implements Language {
    languageName: string = "English";
    //header
    settings: string = "Settings";
    // index
    createRoomDescribiton: string = "Create a new Room";
    createRoom: string = "New Room";
    joinRoomDescribiton: string = "Join a room";
    joinRoom: string = "Join Room";
    vidsyncDescribtion: string = "Vidsync is an open-source project, which allows users to watch YouTube videos together by creating or joining Rooms to watch with your friends.";
    inviteBotDescribtion: string = "Invite the Vidsync Discord Bot to your Discord Server.";
    inviteBot: string = "Invite Discord Bot";
    botDescrition: string = "The Vidsync Discord Bot will answer to every Youtube link, by creating a room for the linked video or even a whole playlist. The bot is open-source aswell";
    //room
    addVideo: string = "Add Video";
    addAll: string = "Add All"
    chat: string = "Chat"
    queue: string = "Queue";
    results: string = "results";
    copyInviteLinkDescrition: string = "Copy Invite Link";
    sendMessage: string = "Send Message";
    theatreMode: string = "Theatre Mode";
    searchYTDescrition: string = "Search for a Video (Title or Url) or a Playlist(Url) on Youtube";
    searchYT: string = "Search YT";
    //settings
    username: string = "Username";
    update: string = "Update";
    language: string = "Language";
}