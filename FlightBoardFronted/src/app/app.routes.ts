import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent) },
    { path: 'flight-board', loadComponent: () => import('./features/pages/flight-board/flight-board.component').then(m => m.FlightBoardComponent),
    canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login' },
];
