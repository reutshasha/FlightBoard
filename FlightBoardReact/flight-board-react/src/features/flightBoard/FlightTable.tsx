import type { Flight } from '../../models/Flight';
import { getFlightStatus } from '../../utils/getFlightStatus';

export const FlightTable = ({ flights, onDelete }: {
  flights: Flight[];
  onDelete: (id: number) => void;
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Flight #</th>
          <th>Destination</th>
          <th>Departure</th>
          <th>Gate</th>
          <th>Status</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {flights.map(f => {
          const status = getFlightStatus(f.departureTime);
          return (
            <tr key={f.id}>
              <td>{f.flightNumber}</td>
              <td>{f.destination}</td>
              <td>{new Date(f.departureTime).toLocaleString()}</td>
              <td>{f.gate}</td>
              <td className={`status-cell ${status}`}>{status}</td>
              <td>
                <button className="delete-btn" onClick={() => onDelete(f.id)}>🗑️</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
