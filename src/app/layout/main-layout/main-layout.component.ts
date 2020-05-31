import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
	@Output() public sidenavToggle = new EventEmitter();
	constructor() {
		console.log('Main layout constructor called');
   	}

  	ngOnInit(): void {
  	}

	public onToggleSidenav = () => {
		this.sidenavToggle.emit();
	}
}
