// instrumentService.ts
import { Instrument } from '../store/types';

const BASE_URL = import.meta.env.VITE_MOCKAPI_BASE_URL;
const ENDPOINT = import.meta.env.VITE_MOCKAPI_INSTRUMENTS_ENDPOINT;

export const getInstruments = async (): Promise<Instrument[]> => {
  const response = await fetch(`${BASE_URL}${ENDPOINT}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch instruments: ${response.status}`);
  }
  return response.json();
};

export const getInstrumentById = async (id: string): Promise<Instrument> => {
  const response = await fetch(`${BASE_URL}${ENDPOINT}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch instrument with id ${id}`);
  }
  return response.json();
};

export const createInstrument = async (instrument: Instrument): Promise<Instrument> => {
  const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instrument),
  });
  if (!response.ok) {
    throw new Error('Failed to create instrument');
  }
  return response.json();
};

export const updateInstrument = async (id: string, instrument: Partial<Instrument>): Promise<Instrument> => {
  const response = await fetch(`${BASE_URL}${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instrument),
  });
  if (!response.ok) {
    throw new Error('Failed to update instrument');
  }
  return response.json();
};

export const deleteInstrument = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}${ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete instrument');
  }
};
