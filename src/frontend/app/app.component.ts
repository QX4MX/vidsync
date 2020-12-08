import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {


    constructor() {
    }

    ngOnInit(): void {
        let cc = window as any;
        cc.cookieconsent.initialise({
            palette: {
                popup: {
                    background: "rgb(40, 22, 47)"
                },
                button: {
                    background: "rgb(166, 30, 83)",
                    text: "rgb(255, 255, 255)"
                }
            },
            theme: "classic",
            revokable: true,
            content: {
                header: 'Cookies used on the website!',
                message: 'This website uses cookies to improve your experience.',
                dismiss: 'Got it!',
                allow: 'Allow cookies',
                deny: 'Decline',
                link: 'Learn more',
                href: 'https://www.cookiesandyou.com',
                close: '&#x274c;',
                policy: 'Cookie Policy',
                target: '_blank',
            },
            hasTransition: true,
            onStatusChange: function (status) {
                if (this.hasConsented()) {
                    let domain = "vidsync.de"
                    document.cookie = "domain=" + domain + ";";
                    document.cookie = "SameSite='Lax';"
                    /* document.cookie = "Secure"; if samesite is none*/
                }
            }
        });
    }


}
