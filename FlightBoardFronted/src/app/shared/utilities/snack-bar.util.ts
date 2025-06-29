import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackBarUtil {
    public static readonly Duration = {
        SHORT: 1500,
        LONG: 3000,
        INDEFINITE: 0,
    };

    private snackBar = inject(MatSnackBar);

    public show(message: string, duration: number = SnackBarUtil.Duration.SHORT): void {
        this.snackBar.open(message, '', { duration });
    }
}