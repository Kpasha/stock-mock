import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authSub: ISubscription;

  errorObj: {
    hasError: boolean,
    errorMessage: string
  };

  constructor(private router: Router, private authService: AuthService) { }

  ngOnDestroy()
  {
    this.authSub.unsubscribe();
  }

  ngOnInit() {
    this.errorObj = {
      hasError: false,
      errorMessage: ""
    };

    this.authSub = this.authService.checkAuth()
    .subscribe(auth => {
      if(auth){
        this.router.navigate(['']);
      }
      else{
        console.log('not logged in');
      }
    });
  }

  login(email, password) {
    this.authService.login(email, password)
    .then(data => {
      this.router.navigate(['']);
    })
    .catch(error => {
      this.errorObj = {
        hasError: true,
        errorMessage: error.message
      };
    });
  }
}
