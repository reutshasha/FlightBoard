import { Component, inject, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { SnackBarUtil } from '../../../shared/utilities/snack-bar.util';
import { Flight } from '../../../shared/models/flight';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../../angular-material.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { SignalrService } from '../../../core/services/signalr.service';
import { interval, Subscription } from 'rxjs';


type FlightRow = Flight & { status: string; justAdded?: boolean; justUpdated?: boolean };

@Component({
  selector: 'app-flight-board',
  templateUrl: './flight-board.component.html',
  styleUrl: './flight-board.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AngularMaterialModule, ReactiveFormsModule],
  animations: [
    trigger('rowFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class FlightBoardComponent {
  displayedColumns: string[] = ['flightNumber', 'destination', 'departureTime', 'gate', 'status', 'delete'];
  dataSource = new MatTableDataSource<FlightRow>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  flightForm!: FormGroup;
  filterForm!: FormGroup;
  allFlights: FlightRow[] = [];

  private apiService = inject(ApiService);
  private snackBar = inject(SnackBarUtil);
  private fb = inject(FormBuilder);
  private signalR = inject(SignalrService);
  private refreshStatusSubscription!: Subscription;
  private signalRSubscriptions!: Subscription[];


  ngOnInit() {
    this.flightForm = this.fb.group({
      flightNumber: ['', Validators.required],
      destination: ['', Validators.required],
      departureTime: ['', [Validators.required, this.futureDateValidator]],
      gate: ['', Validators.required]
    });

    this.filterForm = this.fb.group({
      status: [''],
      destination: ['']
    });

    this.loadFlights();

    this.signalR.startConnection();

    this.signalR.flightAdded$.subscribe((flight: Flight) => {
      const flightWithStatus = {
        ...flight,
        status: this.getFlightStatus(new Date(flight.departureTime))
      };

      this.dataSource.data = [...this.dataSource.data, flightWithStatus];
      this.snackBar?.show('טיסה חדשה נוספה בזמן אמת');
    });

    this.signalR.flightDeleted$.subscribe((id: number) => {
      this.dataSource.data = this.dataSource.data.filter(f => f.id !== id);
      this.snackBar?.show('טיסה נמחקה בזמן אמת');
    });

    this.signalRSubscriptions = [
      this.signalR.flightAdded$.subscribe((flight: Flight) => {
        const flightWithStatus = {
          ...flight,
          status: this.getFlightStatus(new Date(flight.departureTime)),
          justAdded: true
        };
        this.dataSource.data = [...this.dataSource.data, flightWithStatus];

        this.highlightRowTemporarily(flightWithStatus.id!, 'justAdded');
      }),

      this.signalR.flightDeleted$.subscribe((id: number) => {
        this.dataSource.data = this.dataSource.data.filter(f => f.id !== id);
      })
    ];
    this.refreshStatusSubscription = interval(120000).subscribe(() => {
      this.updateFlightStatuses();
    });

  }

  ngOnDestroy() {
    this.refreshStatusSubscription?.unsubscribe();
    this.signalRSubscriptions.forEach(s => s.unsubscribe());
  }
  loadFlights(): void {
    const { status, destination } = this.filterForm.value;

    this.apiService.getAllFlights(status, destination).subscribe({
      next: (response) => {
        this.allFlights = response.data.map((flight: Flight) => ({
          ...flight,
          status: this.getFlightStatus(new Date(flight.departureTime))
        }));
        this.dataSource.data = [...this.allFlights];

        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;

        this.snackBar?.show('טיסות נטענו בהצלחה!');
      },
      error: (error) => {
        const msg = error?.message || 'שגיאה לא צפויה בטעינת הטיסות.';
        console.error('HTTP Error:', error);
        this.snackBar?.show(msg);
      }
    });
  }

  onAddFlight() {
    if (this.flightForm.invalid) return;

    const raw = this.flightForm.value;
    const dateOnly = new Date(raw.departureTime);
    dateOnly.setHours(12, 0, 0, 0);

    const flight = {
      ...raw,
      departureTime: dateOnly.toISOString()
    };

    this.apiService.addFlight(flight).subscribe({
      next: (response: any) => {
        const newFlight = response.data;

        console.log('Flight returned from API:', newFlight); // בדיקה חשובה

        const flightWithStatus = {
          id: newFlight.id,
          flightNumber: newFlight.flightNumber,
          destination: newFlight.destination,
          departureTime: newFlight.departureTime,
          gate: newFlight.gate,
          status: this.getFlightStatus(new Date(newFlight.departureTime)),
          justAdded: true
        };

        this.dataSource.data = [...this.dataSource.data, flightWithStatus];

        setTimeout(() => {
          flightWithStatus.justAdded = false;
        }, 2000);

        this.flightForm.reset();
        this.snackBar?.show('טיסה נוספה בהצלחה!');
      },
      error: (err) => {
        console.error('Add error:', err);
        this.snackBar?.show('שגיאה בהוספת טיסה');
      }
    });
  }

  deleteFlight(id: number) {
    this.apiService.deleteFlight(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(f => f.id !== id);
        this.snackBar?.show('הטיסה נמחקה בהצלחה');
      },
      error: (err) => {
        console.error('Delete error', err);
        this.snackBar?.show('שגיאה במחיקת טיסה');
      }
    });
  }

  applyClientFilters() {
    const { status, destination } = this.filterForm.value;

    let filtered = [...this.allFlights];

    if (status) {
      filtered = filtered.filter(f => f.status === status);
    }

    if (destination) {
      filtered = filtered.filter(f =>
        f.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    this.dataSource.data = filtered;

    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  clearFilters() {
    this.filterForm.reset();
    this.loadFlights();
  }

  futureDateValidator(control: any) {
    return new Date(control.value) > new Date() ? null : { notFuture: true };
  }

  updateFlightStatuses() {
    let updated = false;

    const newData = this.dataSource.data.map(flight => {
      const oldStatus = flight.status;
      const newStatus = this.getFlightStatus(new Date(flight.departureTime));

      if (oldStatus !== newStatus) {
        updated = true;
        return { ...flight, status: newStatus, justUpdated: true };
      }
      return flight;
    });

    if (updated) {
      this.dataSource.data = newData;
      newData.forEach(flight => {
        if (flight.justUpdated) {
          this.highlightRowTemporarily(flight.id!, 'justUpdated');
        }
      });
    }
  }

  highlightRowTemporarily(id: number, className: 'justAdded' | 'justUpdated') {
    setTimeout(() => {
      const index = this.dataSource.data.findIndex(f => f.id === id);
      if (index !== -1) {
        const flight = this.dataSource.data[index];
        if (className === 'justAdded') flight.justAdded = false;
        if (className === 'justUpdated') flight.justUpdated = false;

        this.dataSource.data = [...this.dataSource.data];
      }
    }, 3000);
  }

  getFlightStatus(departureTime: Date): string {
    const now = new Date();
    const diff = (departureTime.getTime() - now.getTime()) / 60000;

    if (diff > 30) return "Scheduled";
    if (diff > 10) return "Boarding";
    if (diff >= -60) return "Departed";
    if (diff < -60) return "Landed";
    if (diff < -15) return "Delayed";
    return "Scheduled";
  }
}