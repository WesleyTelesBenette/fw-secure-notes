import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component
({
	selector: 'app-input-password',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './input-password.component.html',
	styleUrl: './input-password.component.scss'
})
export class InputPasswordComponent
{
	@Input() password: string = '';
	@Input() placeholder: string = '';
	@Output() passwordChange = new EventEmitter<string>();

	public showPassword: boolean = false;

	public updatePassword(password: string)
	{
		this.password = password;
		this.passwordChange.emit(this.password);
	}

	public toggleShowPassword()
	{
		this.showPassword = !this.showPassword;
	}
}
