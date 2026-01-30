import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "express";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
  export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
//   private router = inject(Router); 

  loading = false; error = '';
  form = this.createForm();

  ngOnInit(): void {}

  protected createForm(): FormGroup {
    return new FormGroup({
        email: new FormControl<null | string>(null, [Validators.required, Validators.email]),
        password: new FormControl<null | string>(null, [Validators.required]),
    });
  }
  
  onSubmit() {}
}