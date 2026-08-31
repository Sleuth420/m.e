import type { RoomInteractId } from './room-layout';

export type RoomPlayState = {
  lightSwitchOn: boolean;
  fridgeOpen: boolean;
  toasterPop: boolean;
  isolatorOn: boolean;
  sinkOn: boolean;
  boiling: boolean;
  openById: Partial<Record<RoomInteractId, boolean>>;
  loungeDimmer: number;
  tvOn: boolean;
};

export const INITIAL_ROOM_PLAY: RoomPlayState = {
  lightSwitchOn: true,
  fridgeOpen: false,
  toasterPop: false,
  isolatorOn: true,
  sinkOn: false,
  boiling: false,
  openById: {},
  loungeDimmer: 0,
  tvOn: false,
};

export type RoomLive = {
  powerLive: boolean;
  hobLive: boolean;
  loungePowerLive: boolean;
};

export type RoomPlayAction =
  | { type: 'interact'; id: RoomInteractId; live: RoomLive }
  | { type: 'power-cut' }
  | { type: 'hob-cut' }
  | { type: 'lounge-power-cut' };

export function nextDimmer(v: number): number {
  if (v < 0.12) return 0.35;
  if (v < 0.52) return 0.7;
  if (v < 0.88) return 1;
  return 0;
}

export function roomPlayReducer(state: RoomPlayState, action: RoomPlayAction): RoomPlayState {
  switch (action.type) {
    case 'power-cut':
      return state.toasterPop ? { ...state, toasterPop: false } : state;
    case 'hob-cut':
      return state.boiling ? { ...state, boiling: false } : state;
    case 'lounge-power-cut':
      return state.tvOn ? { ...state, tvOn: false } : state;
    case 'interact':
      return applyInteract(state, action.id, action.live);
    default:
      return state;
  }
}

function applyInteract(state: RoomPlayState, id: RoomInteractId, live: RoomLive): RoomPlayState {
  if (id === 'switch') return { ...state, lightSwitchOn: !state.lightSwitchOn };
  if (id === 'toaster' || id === 'gpoDouble') {
    if (!live.powerLive) return state;
    return { ...state, toasterPop: !state.toasterPop };
  }
  if (id === 'fridge') return { ...state, fridgeOpen: !state.fridgeOpen };
  if (id === 'cookIsolator') return { ...state, isolatorOn: !state.isolatorOn };
  if (id === 'cooktop') {
    if (!live.hobLive) return state;
    return { ...state, boiling: !state.boiling };
  }
  if (id === 'sink') return { ...state, sinkOn: !state.sinkOn };
  if (id === 'loungeDimmerA' || id === 'loungeDimmerB') {
    return { ...state, loungeDimmer: nextDimmer(state.loungeDimmer) };
  }
  if (id === 'tv' || id === 'tvGpo') {
    if (!live.loungePowerLive) return state;
    return { ...state, tvOn: !state.tvOn };
  }
  return { ...state, openById: { ...state.openById, [id]: !state.openById[id] } };
}
