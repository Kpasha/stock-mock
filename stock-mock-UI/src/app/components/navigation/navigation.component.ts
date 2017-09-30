import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  currentRoute: any;
  user: any;

  authSub: ISubscription;
  dataSub: ISubscription;

  constructor(public router: Router, public authService: AuthService) { }

  ngOnDestroy() {
    if(this.authSub) this.authSub.unsubscribe();
    if(this.dataSub) this.dataSub.unsubscribe();
  }

  ngOnInit() {
    this.currentRoute = {
      url: ""
    };

    this.router.events.subscribe((event) => {
      this.currentRoute = event;
    });

    this.authService.checkAuth()
    .subscribe(response => {
      this.user = response;
    });
  }

  logout()
  {
    this.authService.logout()
    .then(_ => {
      this.router.navigate(['login']);
    });
  }
}
