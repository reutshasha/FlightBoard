import { useState } from 'react';
import './AddFlightModal.scss';

interface Props {
  onClose: () => void;
  onSubmit: (flightData: any) => void;
}

export const AddFlightModal = ({ onClose, onSubmit }: Props) => {
  const [form, setForm] = useState({
    flightNumber: '',
    destination: '',
    gate: '',
    departureTime: '',
  });

  const [errors, setErrors] = useState({
    flightNumber: '',
    destination: '',
    gate: '',
    departureTime: '',
    departureInPast: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', departureInPast: '' }));
  };

  const validate = () => {
    const flightRegex = /^[A-Z]{2}\d{3,6}$/i;
    const destinationRegex = /^[A-Za-z\s]+$/;
    const gateRegex = /^[A-Za-z0-9]+$/;

    const now = new Date();
    const departure = form.departureTime ? new Date(form.departureTime) : null;

    const newErrors = {
      flightNumber: !form.flightNumber.trim()
        ? 'Flight number is required'
        : !flightRegex.test(form.flightNumber)
          ? 'Format: 2 letters + 3–6 digits (e.g., LY3456)'
          : '',

      destination: !form.destination.trim()
        ? 'Destination is required'
        : !destinationRegex.test(form.destination)
          ? 'Only letters allowed (no numbers/symbols)'
          : '',

      gate: !form.gate.trim()
        ? 'Gate is required'
        : !gateRegex.test(form.gate)
          ? 'Gate must contain only letters and/or digits'
          : '',

      departureTime: !form.departureTime.trim()
        ? 'Departure time is required'
        : '',

      departureInPast: ''
    };

    if (form.departureTime && departure && departure <= now) {
      newErrors.departureInPast = 'Departure time must be in the future';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(e => e === '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };
  const isFormValid =
    form.flightNumber.trim() &&
    /^[A-Z]{2}\d{3,6}$/i.test(form.flightNumber) &&
    form.destination.trim() &&
    /^[A-Za-z\s]+$/.test(form.destination) &&
    form.gate.trim() &&
    /^[A-Za-z0-9]+$/.test(form.gate) &&
    form.departureTime &&
    new Date(form.departureTime) > new Date();

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Flight</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="flightNumber"
            placeholder="e.g., LY3456"
            value={form.flightNumber}
            onChange={handleChange}
            className={errors.flightNumber ? 'error' : ''}
          />
          {errors.flightNumber && <p className="error">{errors.flightNumber}</p>}

          <input
            type="text"
            name="destination"
            placeholder="e.g., Tel Aviv"
            value={form.destination}
            onChange={handleChange}
            className={errors.destination ? 'error' : ''}
          />
          {errors.destination && <p className="error">{errors.destination}</p>}

          <input
            type="text"
            name="gate"
            placeholder="e.g., A12"
            value={form.gate}
            onChange={handleChange}
            className={errors.gate ? 'error' : ''}
          />
          {errors.gate && <p className="error">{errors.gate}</p>}

          <input
            type="datetime-local"
            name="departureTime"
            value={form.departureTime}
            onChange={handleChange}
            className={errors.departureTime || errors.departureInPast ? 'error' : ''}
          />
          {errors.departureTime && <p className="error">{errors.departureTime}</p>}
          {errors.departureInPast && <p className="error">{errors.departureInPast}</p>}

          <div className="actions">
            <button type="submit" disabled={!isFormValid} className={!isFormValid ? 'disabled' : ''}>
              Add
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
