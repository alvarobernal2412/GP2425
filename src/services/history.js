import { client } from '@/api/axiosClient';

export function getHistoryById(id) {
  return client.get(`/histories/${id}`);
}

export function getHistoryByPatientId(id) {
  return client.get(`/histories/patient/${id}`);
}

export function addCondition(id, { name, details, since, until }) {
  return client.post(
    `/histories/${id}/condition`,
    { name, details, since, until }
  );
}

export function editCondition(id, conditionId, { name, details, since, until }) {
  return client.put(
    `/histories/${id}/condition/${conditionId}`,
    { name, details, since, until: until || null }
  );
}

export function deleteCondition(id, conditionId) {
  return client.delete(`/histories/${id}/condition/${conditionId}`);
}

export function addTreatment(id, { name, instructions, startDate, endDate }) {
  return client.post(
    `/histories/${id}/treatment`,
    { name, instructions, startDate, endDate }
  );
}

export function editTreatment(id, treatmentId, { name, instructions, startDate, endDate }) {
  return client.put(
    `/histories/${id}/treatment/${treatmentId}`,
    { name, instructions, startDate, endDate }
  );
}

export function deleteTreatment(id, treatmentId) {
  return client.delete(`/histories/${id}/treatment/${treatmentId}`);
}

export function uploadImage(id, formData) {
  return client.post(`/histories/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteImage(id, imageId) {
  return client.delete(`/histories/${id}/image/${imageId}`);
}

export function uploadAnalytic(id, formData) {
  return client.post(`/histories/${id}/analytic`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteAnalytic(id, analyticId) {
  return client.delete(`/histories/${id}/analytic/${analyticId}`);
}

export function addAllergy(id, { allergy }) {
  return client.post(`/histories/${id}/allergy`, {allergy});
}

export function deleteAllergy(id, allergyId) {
  return client.delete(`/histories/${id}/allergy/${allergyId}`);
}

export function getReport(id) {
  return client.get(`/histories/${id}/report`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/pdf',
    },
  });
};
