import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		if(window.innerWidth < 1024){
			this.smallScreen = true;
		}
		else{
			this.smallScreen = false;
			
		}
		this.onToggleSidenav();
	}
	@Output() public sidenavToggle = new EventEmitter();
	smallScreen = true;
	constructor() {
		console.log('Main layout constructor called');
   	}

  	ngOnInit(): void {
		  this.onResize();
  	}

	public onToggleSidenav = () => {
		this.sidenavToggle.emit();
	}
}
