import { nearBoard, nearestRoomInteract, type RoomInteractId } from './room-layout';

export function tryRoomInteract(
  x: number,
  z: number,
  preferHigh: boolean,
  coverOpen: boolean,
  onInteract: (id: RoomInteractId) => void,
  requestCoverOpen: () => void
): boolean {
  const hit = nearestRoomInteract(x, z, [], preferHigh);
  if (hit) {
    onInteract(hit.id);
    return true;
  }
  if (nearBoard(x, z) && !coverOpen) {
    requestCoverOpen();
    return true;
  }
  return false;
}
