import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    email = 'btcusd-arbitrage@demo.com';
    password = 'btcusd-arbitrage';

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    submit() {
        // TODO: implement login
        this.router.navigate(['/home'])
    }
}
