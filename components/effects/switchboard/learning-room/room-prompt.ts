import type { InteractSpot, RoomInteractId } from './room-layout';
import type { RoomPlayState } from './room-play';

export type RoomPromptLive = {
  powerLive: boolean;
  hobLive: boolean;
  loungePowerLive: boolean;
  loungeLightLive: boolean;
  coverOpen: boolean;
  coarse: boolean;
};

export function formatInteractVerb(prompt: string, coarse: boolean): string {
  return coarse ? prompt.replaceAll('F · ', 'Tap · ') : prompt;
}

export function loungeDimmerPrompt(live: boolean, dimmer: number): string {
  if (!live) return 'Lounge lighting is off';
  if (dimmer < 0.12) return 'F · Dim lounge lights';
  if (dimmer < 0.52) return 'F · Dim 70%';
  if (dimmer < 0.88) return 'F · Dim 100%';
  return 'F · Lounge lights off';
}

function promptForHit(
  hit: InteractSpot<RoomInteractId>,
  play: RoomPlayState,
  live: RoomPromptLive
): string {
  switch (hit.id) {
    case 'toaster':
    case 'gpoDouble':
      return !live.powerLive ? 'Kitchen power is off' : play.toasterPop ? hit.promptClose : hit.promptOpen;
    case 'cookIsolator':
      return play.isolatorOn ? 'F · Isolator off' : 'F · Isolator on';
    case 'cooktop':
      return !live.hobLive ? 'Turn the isolator on' : play.boiling ? hit.promptClose : hit.promptOpen;
    case 'sink':
      return play.sinkOn ? hit.promptClose : hit.promptOpen;
    case 'loungeDimmerA':
    case 'loungeDimmerB':
      return loungeDimmerPrompt(live.loungeLightLive, play.loungeDimmer);
    case 'tv':
    case 'tvGpo':
      return !live.loungePowerLive ? 'Lounge power is off' : play.tvOn ? hit.promptClose : hit.promptOpen;
    default: {
      const isOpen =
        hit.id === 'fridge'
          ? play.fridgeOpen
          : hit.id === 'switch'
            ? play.lightSwitchOn
            : !!play.openById[hit.id];
      return isOpen ? hit.promptClose : hit.promptOpen;
    }
  }
}

export function roomActionPrompt(
  hit: InteractSpot<RoomInteractId> | null,
  nearTheBoard: boolean,
  play: RoomPlayState,
  live: RoomPromptLive
): string {
  let next: string;
  if (hit) {
    next = promptForHit(hit, play, live);
  } else if (nearTheBoard) {
    next = live.coverOpen
      ? 'Tap a breaker rocker · TEST trips the RCD'
      : live.coarse
        ? 'Tap the cover · licensed only'
        : 'Tap the cover or F · licensed only';
  } else {
    next = 'Walk to the board, kitchen, or lounge';
  }
  return formatInteractVerb(next, live.coarse);
}
