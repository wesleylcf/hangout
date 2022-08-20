export interface Event {
  status: EventStatus;
  participantIds: string[];
  creatorId: string;
  missingInfoMap: MissingInfoMap;
  acceptedInviteMap: AcceptedInviteMap;
}

export enum EventStatus {
  PENDING = 'PENDING ACCEPTANCE',
  IN_PROGRESS = 'IN PROGRESS',
  READY = 'READY',
  ACTIVE = 'ACTIVE',
}

interface MissingInfoMap {
  [userId: string]: boolean;
}

interface AcceptedInviteMap {
  [userId: string]: boolean;
}
