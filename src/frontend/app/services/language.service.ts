import { Injectable } from '@angular/core';
import { EnglishLanguage } from '../language-files/english';
import { GermanLanguage } from '../language-files/german'
@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    languagesArr: Array<Language> = [new EnglishLanguage(), new GermanLanguage()]
    currentLanguage: Language;
    constructor() {
        let lanName = localStorage.getItem('language');
        if (lanName) {
            this.currentLanguage = this.getLanguageByName(lanName);
        }
        else {
            this.currentLanguage = this.languagesArr[0];
        }
    }

    getLanguageByName(name: string) {
        for (let language of this.languagesArr) {
            if (language.languageName == name) {
                return language;
            }
        }
        return;
    }

    updateLanguage(language: Language) {
        this.currentLanguage = language;
        localStorage.setItem('language', language.languageName);
    }
}

export interface Language {
    languageName: string;
    //header
    settings: string;
    // index
    createRoomDescribiton: string;
    createRoom: string;
    joinRoomDescribiton: string;
    joinRoom: string;
    vidsyncDescribtion: string;
    inviteBotDescribtion: string;
    inviteBot: string;
    botDescrition: string;
    //room
    addVideo: string;
    addAll: string;
    chat: string;
    queue: string;
    results: string;
    copyInviteLinkDescrition: string;
    sendMessage: string;
    theatreMode: string;
    searchYTDescrition: string;
    searchYT: string;
    //settings
    username: string;
    update: string;
    language: string;
}
