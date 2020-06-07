import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
	selector: 'app-room-create',
	templateUrl: './room-create.component.html',
	styleUrls: ['./room-create.component.scss']
})

export class RoomCreateComponent implements OnInit {

	selected = 'option1';
	submitted = false;
	createRoom: FormGroup;
	RoomProfile: any = ['Finance', 'BDM', 'HR', 'Sales', 'Admin']

	constructor(
		public fb: FormBuilder,
		private router: Router,
		private ngZone: NgZone,
		private apiService: ApiService
	) {
		this.mainForm();
	}

	ngOnInit() { }

	mainForm() {
		this.createRoom = this.fb.group({
			name: ['', [Validators.required]],
			privacy: ['Public', [Validators.required]],
			permanent: ['True', [Validators.required]],
			editable: ['True', [Validators.required]],
		})
	}

	// Getter to access form control
	get myForm() {
		return this.createRoom.controls;
	}

	onSubmit() {
		this.submitted = true;
		if (!this.createRoom.valid) {
			console.log("Not Valid");
			return false;
		} else {
			this.apiService.createRoom(this.createRoom.value).subscribe(
				(res) => {
					console.log('Room successfully created!')
					console.log(res);
					this.ngZone.run(() => this.router.navigateByUrl('/room/' + res._id));
				}, (error) => {
					console.log(error);
				});
		}
	}

}