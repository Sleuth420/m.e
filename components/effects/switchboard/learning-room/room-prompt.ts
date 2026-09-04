import type { InteractSpot, RoomInteractId } from './room-layout';
import type { RoomPlayState } from './room-play';

export type PromptTone = 'default' | 'caution' | 'danger';

export type RoomActionPrompt = {
  text: string;
  tone: PromptTone;
};

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

function stripInteractVerb(prompt: string): string {
  return prompt.replace(/^(?:F|Tap) · /, '');
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
): RoomActionPrompt {
  switch (hit.id) {
    case 'toaster':
    case 'gpoDouble':
      return !live.powerLive
        ? { text: 'Kitchen power is off', tone: 'caution' }
        : { text: play.toasterPop ? hit.promptClose : hit.promptOpen, tone: 'default' };
    case 'cookIsolator':
      return { text: play.isolatorOn ? 'F · Isolator off' : 'F · Isolator on', tone: 'caution' };
    case 'cooktop':
      return !live.hobLive
        ? { text: 'Turn the isolator on', tone: 'caution' }
        : { text: play.boiling ? hit.promptClose : hit.promptOpen, tone: 'default' };
    case 'sink':
      return { text: play.sinkOn ? hit.promptClose : hit.promptOpen, tone: 'default' };
    case 'loungeDimmerA':
    case 'loungeDimmerB': {
      const text = loungeDimmerPrompt(live.loungeLightLive, play.loungeDimmer);
      return { text, tone: live.loungeLightLive ? 'default' : 'caution' };
    }
    case 'tv':
    case 'tvGpo':
      return !live.loungePowerLive
        ? { text: 'Lounge power is off', tone: 'caution' }
        : { text: play.tvOn ? hit.promptClose : hit.promptOpen, tone: 'default' };
    default: {
      const isOpen =
        hit.id === 'fridge'
          ? play.fridgeOpen
          : hit.id === 'switch'
            ? play.lightSwitchOn
            : !!play.openById[hit.id];
      return { text: isOpen ? hit.promptClose : hit.promptOpen, tone: 'default' };
    }
  }
}

function withVerb(prompt: RoomActionPrompt, coarse: boolean): RoomActionPrompt {
  return { text: formatInteractVerb(prompt.text, coarse), tone: prompt.tone };
}

export function roomActionPrompt(
  hit: InteractSpot<RoomInteractId> | null,
  nearTheBoard: boolean,
  play: RoomPlayState,
  live: RoomPromptLive,
  hint: InteractSpot<RoomInteractId> | null = null,
  boardHint = false
): RoomActionPrompt {
  if (live.coverOpen) {
    return {
      text: live.coarse
        ? 'Tap a breaker · move to step back'
        : 'Tap a breaker · F / Esc closes cover',
      tone: 'caution',
    };
  }

  if (hit) return withVerb(promptForHit(hit, play, live), live.coarse);

  if (nearTheBoard) {
    return withVerb(
      {
        text: live.coarse ? 'Tap the cover · licensed only' : 'Tap the cover or F · licensed only',
        tone: 'caution',
      },
      live.coarse
    );
  }

  if (hint) {
    const inner = promptForHit(hint, play, live);
    return {
      text: `Walk closer · ${stripInteractVerb(formatInteractVerb(inner.text, live.coarse))}`,
      tone: inner.tone,
    };
  }

  if (boardHint) {
    return { text: 'Walk closer · Open cover', tone: 'caution' };
  }

  return { text: 'Walk to the board, kitchen, or lounge', tone: 'default' };
}
