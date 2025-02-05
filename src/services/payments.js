import { client } from '@/api/axiosClient';

export async function obtainPlans() {
  return await client.get('/plans');
}

export function getClinicData(clinicId) {
  return client.get(`/clinics/${clinicId}`).then(response => response.data);
}

export async function registerClinic({
  name,
  city,
  district,
  plan,
  active,
  postalCode,
  countryCode = 'ES',
}) {
  const clinicData = {
    name,
    city,
    district,
    plan,
    active,
    postalCode,
    countryCode,
  };

  try {
    const response = await client.post('/clinics/', clinicData, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const { data } = response;
    return data._id;
  } catch (error) {
    throw new Error('Error registering the clinic',error);
  }
}


export async function getClinicById(id) {
  return await client.get(`clinics/${id}`);
}

export async function getDoctorById(id) {
  return await client.get(`staff/${id}`);
}

export async function getPlanById(id) {
  return await client.get(`plans/${id}`);
}

export async function updateClinic(id, clinicData) {
  return await client.put(`/clinics/${id}`, clinicData,{
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export async function registerPayment({
  planId,
  clinicId
}) {
  const paymentData = {
    planId,
    clinicId
  };

  try {
    const response = await client.post('/payments/', paymentData, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    const { data } = response;
    return data.url;
  } catch (error) {
    throw new Error('Error registering the payment',error);
  }
}
