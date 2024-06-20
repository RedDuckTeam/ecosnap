import { httpClient } from '../client';

export enum ParticipationStatus {
  ACCEPTED = 0,
  REJECTED = 1,
}

export interface Participant {
  participationId: string;
  participant: string;
  status: ParticipationStatus;
  resultStatus: ParticipationStatus;
}

export interface ParticipantsObject {
  participants: Participant[];
}

const GET_EVENTS = 'api/cleanup-event/participatants';

export const getParticipants = async (eventId: string) => {
  return await httpClient.get<ParticipantsObject>(`${GET_EVENTS}/?eventId=${eventId}`);
};
