import { Language } from '../services/language.service';
export class GermanLanguage implements Language {
    languageName: string = "Deutsch";
    //header
    settings: string = "Einstellungen";
    // index
    createRoomDescribiton: string = "Erstelle einen neuen Raum";
    createRoom: string = "Neuer Raum";
    joinRoomDescribiton: string = "Einem Raum beitreten";
    joinRoom: string = "Raum beitreten";
    vidsyncDescribtion: string = "Vidsync ist ein open-source Projekt, welches Benutzern erlaubt Youtube videos gemeinsam mit Freunden zu schauen indem sie Räume erstellen oder beitreten.";
    inviteBotDescribtion: string = "Lade den Discord Bot auf deinen Discord-Server";
    inviteBot: string = "Bot einladen";
    botDescrition: string = "Der Vidsync Discord Bot antwortet auf Youtube-Links in euerem Chat mit einem Vidsync-Raum-Link, wo bereits das gepostete Video / Playlist eingestellt ist.Der Bot ist auch Open-Source";
    //room
    addVideo: string = "Video hinzufügen";
    addAll: string = "Alle hinzufügen"
    chat: string = "Chat"
    queue: string = "Warteliste";
    history: string = "Verlauf";
    results: string = "Ergebnisse";
    copyInviteLinkDescrition: string = "Link kopieren";
    sendMessage: string = "Nachricht schreiben";
    theatreMode: string = "Theater Mode";
    searchYTDescrition: string = "Suche ein Video (Titel oder Url) oder eine Playlist auf Youtube.";
    searchYT: string = "Suche auf Youtube";
    searchTwitchDescrition: string = "Suche einen Stream oder Vod auf Twitch (Url)";
    searchTwitch: string = "Twitc Url (Kanal oder Vod)";
    roomloading: string = "Room läd oder existiert nicht.";
    users: string = "Benutzer";

    //settings
    username: string = "Benutzername";
    update: string = "Update";
    language: string = "Sprache";

    // notfound
    notfounddescribtion: string = "Diese Seite scheint nicht zu existieren.";
    goback: string = "Zurück zur Hauptseite.";
}