import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorObj: {
    hasError: boolean,
    errorMessage: string
  };

  successObj: {
    hasSuccess: boolean,
    successMessage: string
  };

  formObj: {
    email: string,
    name: string,
    password: string,
    passwordConfirm: string
  };

  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.errorObj = {
      hasError: false,
      errorMessage: ""
    };

    this.successObj = {
      hasSuccess: false,
      successMessage: ""
    };

    this.formObj = {
      email: "",
      name: "",
      password: "",
      passwordConfirm: ""
    };
  }

  register(){
    if(this.formObj.password != this.formObj.passwordConfirm){
      this.errorObj = {
        hasError: true,
        errorMessage: "password mismatch"
      };
    }
    else{
      this.authService.register(this.formObj.email, this.formObj.password)
      .then(user => {

        // update displayName on the auth table
        this.authService.updateUser(this.formObj.name)
        .then(response => {

          // add to user table
          const path = `users/${user.uid}`;
          
          const data = {
            email: this.formObj.email,
            displayName: this.formObj.name,
            balance: 5000
          };

          this.authService.update(path, data)
          .then(data => {
            this.authService.logout()
            .then(data => {

              this.formObj = {
                email: "",
                name: "",
                password: "",
                passwordConfirm: ""
              };

              this.errorObj = {
                hasError: false,
                errorMessage: ""
              };

              this.successObj = {
                hasSuccess: true,
                successMessage: "Successfully Registered"
              };
            });
          });
        });
      })
      .catch(error => {
        this.errorObj = {
          hasError: true,
          errorMessage: error.message
        };
      });
    }
  }
}
