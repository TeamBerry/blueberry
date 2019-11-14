import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
    errorMessage: string;
    isCheckingToken = false;
    isResetDone = false;
    resetToken: string;

    resetForm: FormGroup;

    constructor(
        public activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (params: Params) => {
                const resetToken = params['token']

                if (!resetToken) {
                    this.errorMessage = `No reset token has been given. Please follow the link in the mail you recieved when
                    starting the process.`

                } else {
                    this.isCheckingToken = true;
                    this.authService.checkPasswordToken(resetToken).subscribe(
                        (suceess) => {
                            this.resetToken = resetToken;
                            this.resetForm = new FormGroup({
                                password: new FormControl('', [Validators.required]),
                                passwordVerify: new FormControl('', [Validators.required])
                            })

                            this.isCheckingToken = false;
                        },
                        (error) => {
                            this.errorMessage = `The provided token is invalid.`
                            this.isCheckingToken = false;
                        }
                    )
                }
            }
        )
    }

    verifyPassword(): boolean {
        return (this.resetForm.value.password === this.resetForm.value.passwordVerify);
    }

    resetPassword() {
        if (!this.verifyPassword()) {
            this.errorMessage = `Your passwords don't match.`;
            return;
        }

        this.authService.resetPassword(this.resetToken, this.resetForm.value.password).subscribe(
            (response) => {
                this.isResetDone = true;

                setTimeout(() => {
                    this.router.navigate(['/home']);
                }, 4000);
            }
        )
    }

}
