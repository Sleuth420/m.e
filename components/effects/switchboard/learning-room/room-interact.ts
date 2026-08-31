import { BOARD_MOUNT, facingDot, nearBoard, nearestRoomInteract, type RoomInteractId } from './room-layout';

export function tryRoomInteract(
  x: number,
  z: number,
  preferHigh: boolean,
  coverOpen: boolean,
  onInteract: (id: RoomInteractId) => void,
  requestCoverOpen: () => void,
  yaw?: number,
  closeCover?: () => void
): boolean {
  const hit = nearestRoomInteract(x, z, [], preferHigh, yaw);
  if (hit) {
    onInteract(hit.id);
    return true;
  }
  const facingBoard =
    yaw === undefined || facingDot(x, z, yaw, BOARD_MOUNT.x + 0.45, BOARD_MOUNT.z) > 0.12;
  if (nearBoard(x, z) && facingBoard) {
    if (coverOpen) {
      closeCover?.();
      return Boolean(closeCover);
    }
    requestCoverOpen();
    return true;
  }
  return false;
}
