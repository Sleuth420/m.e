# Interactive home

The room is the interface: walk around and click the actual fittings. The only
persistent scene controls are Exit and the wiring/walls switch. A brief movement
hint dismisses on use; an object hint appears only while pointing at a fitting.
There are no room jump buttons, filters or duplicate appliance/circuit panels.

Desktop supports WASD, arrow keys, drag to look, click fittings, F to use nearby
objects, Shift/wheel to zoom and Escape to step back. Touch supports a movement
stick, dragging and direct taps. Click the switchboard door to open or close it;
walking or dragging also leaves the close inspection view. Breaker rockers and
TEST buttons have separate, non-overlapping targets. Drags, secondary-button
zooms and clicks beyond 2.4 m do not operate electrical fittings.

Direct 3D interactions use `roomPlayReducer`. Socket switches operate independently
of appliance controls and circuit supply. Supply loss stops active appliances;
restoration does not automatically restart them. Door and tap actions remain
mechanical. Downlights and kitchen task lights follow the lighting switch; the
lounge dimmer controls lounge fixtures. Daylight is independent of electrical
power. Wiring mode reveals the timber cavities, TPS and board internals.

The model represents an **indoor distribution board supplied from an upstream
main switchboard**. The incoming active, neutral and protective earth are a
submain; the service, meter, main earthing electrode and MEN connection are
upstream and outside this room. There is deliberately no second MEN link here.
The local main isolator disconnects downstream active supply, not the incoming
active. An isolator is not an automatic protective device.

The outer door provides access to operating handles and test buttons. A separate
fixed escutcheon hides terminals in normal view. Wiring mode is a visual cutaway,
not removal of real equipment. Insulated cables do not trigger a fictional shock
game. Seven connected circuits have Type A, 30 mA RCBO representations; unused
ways are labelled spare and start off. A test needs both supply and a closed RCBO.

This is an illustrative simulation, not an AS/NZS 3000 compliance certification
or an installation design. Ratings are examples; cable sizing, protective-device
coordination, fault impedance and trip-time calculations are not simulated.

Public references checked for the representation:

- [Queensland Electrical Safety Office: safety switches](https://www.electricalsafety.qld.gov.au/electrical-safety-home/safety-switches)
- [Clipsal: 1P+N 10 A, 30 mA Type A RCBO](https://www.clipsal.com/products/circuit-protection/acti9/residual-current-breaker-with-overcurrent-protection-rcbo-1p-ns-10a-30ma-a-type-10000a-a9d31810?itemno=A9D31810)
- [Energy Safe Victoria: MEN continuity and duplicate MEN connections](https://www.energysafe.vic.gov.au/industry-guidance/electrical/electrical-technical-information/eis-004-battery-installation-neutral-continuity-and-men-connection)

Existing CC-BY product models and CC0 textures retain their credits under
`public/models/learning-room/CREDITS.md`. New interior and switched socket geometry
is procedural; no additional asset downloads are required.
