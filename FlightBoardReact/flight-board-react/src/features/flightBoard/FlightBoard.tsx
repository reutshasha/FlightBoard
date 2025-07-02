import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFlight, fetchFlights, addFlight } from "../../api/flightApi";
import type { Flight } from "../../models/Flight";
import { getFlightStatus } from "../../utils/getFlightStatus";
import './FlightBoard.scss';
import { AddFlightModal } from "./components/AddFlightModal";
import { startSignalR, stopSignalR } from './services/signalR';

export const FlightBoard = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        startSignalR(
            (flight) => {
                queryClient.setQueryData<Flight[]>(['flights'], old => [...(old || []), flight]);
            },
            (flightId) => {
                queryClient.setQueryData<Flight[]>(['flights'], old =>
                    (old || []).filter(f => f.id !== flightId)
                );
            }
        );
        return () => {
            stopSignalR();
        };
    }, [queryClient]);

    const { data: flights = [], isLoading } = useQuery<Flight[]>({
        queryKey: ['flights'],
        queryFn: () => fetchFlights(),
        refetchInterval: 120_000,
    });

    const [destinationFilter, setDestinationFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const handleClearFilters = () => {
        setDestinationFilter('');
        setStatusFilter('');
    };

    const handleAddFlight = async (flightData: any) => {
        await addFlight(flightData);
        queryClient.invalidateQueries({ queryKey: ['flights'] });
    };

    const handleDelete = async (id: number) => {
        await deleteFlight(id); 
    };


    const filteredFlights = flights.filter(f => {
        const status = getFlightStatus(f.departureTime);
        return (
            (!destinationFilter || f.destination === destinationFilter) &&
            (!statusFilter || status === statusFilter)
        );
    });


    if (isLoading) return <p>Loading flights...</p>;

    return (
        <>
            {showModal && (
                <AddFlightModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddFlight}
                />
            )}
            <div className="flight-board">
                <h2>Real-Time Flight Board</h2>

                <div className="controls">
                    <button onClick={() => setShowModal(true)}>
                        ➕ Add Flight
                    </button>

                    <select
                        value={destinationFilter}
                        onChange={e => setDestinationFilter(e.target.value)}
                    >
                        <option value="">All Destinations</option>
                        {[...new Set(flights.map(f => f.destination))].map(dest => (
                            <option key={dest} value={dest}>{dest}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Boarding">Boarding</option>
                        <option value="Departed">Departed</option>
                        <option value="Landed">Landed</option>
                        <option value="Delayed">Delayed</option>
                    </select>

                    <button onClick={handleClearFilters}>🧹 Clear Filters</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Flight #</th>
                            <th>Destination</th>
                            <th>Departure</th>
                            <th>Gate</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    { }
                    <tbody>
                        {filteredFlights.map(f => {
                            const status = getFlightStatus(f.departureTime);
                            return (
                                <tr key={f.id}>
                                    <td>{f.flightNumber}</td>
                                    <td>{f.destination}</td>
                                    <td>{new Date(f.departureTime).toLocaleString()}</td>
                                    <td>{f.gate}</td>
                                    <td className={`status-cell ${status}`}>{status}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(f.id)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

