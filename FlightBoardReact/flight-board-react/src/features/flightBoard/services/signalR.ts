import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection;

export const startSignalR = (onFlightAdded: (f: any) => void, onFlightDeleted: (id: number) => void) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7051/Hubs/flightHub')
    .withAutomaticReconnect()
    .build();

  connection.on('flightAdded', onFlightAdded);
  connection.on('flightDeleted', onFlightDeleted);

  connection
    .start()
    .catch(err => console.error('SignalR connection error:', err));
};

export const stopSignalR = async () => {
  if (connection) await connection.stop();
};