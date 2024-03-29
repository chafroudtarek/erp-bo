import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User;
  err: string; // `backend/routes/user.js`
  sameUser: boolean;
  username: string;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('user/')) this.initComponent();
      });
  }

  ngOnInit(): void {
    this.initComponent();
  }

  ngOnChanges(): void {
    this.initComponent();
  }

  initComponent(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.user = this.userService.getCurrentUser();
    if (
      !(this.sameUser = !!this.user && this.user.username === this.username)
    ) {
      this.userService.getUserById(this.user._id).subscribe(
        (res) => ((this.user = res), (this.loading = false)),
        (err) => ((this.err = err), (this.loading = false))
      );
    } else this.loading = false;
  }
}
