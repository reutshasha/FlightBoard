import api from './axios';

// export const fetchFlights = async (params?: any) => {
//   const res = await api.get('/flights', { params });
//   return res.data;
// };

export const fetchFlights = async () => {
    const res = await api.get('/flights');
    console.log('🚀 res.data.data =', res.data.data); // לוודא שזה מערך
    return res.data.data;
};

export const addFlight = async (flightData: any) => {
    const res = await api.post('/flights', flightData);
    return res.data;
};

export const deleteFlight = async (id: number) => {
    await api.delete(`/flights/${id}`);
};
