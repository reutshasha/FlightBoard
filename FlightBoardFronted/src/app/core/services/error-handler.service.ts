import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(error: any): void {
    console.error('An error occurred:', error);
    alert('Something went wrong! Please try again later.');
  }}
