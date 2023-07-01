// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-

const GLib = imports.gi.GLib;

// current desktop doesn't change unless we restart the shell or control
// the env variable. It's safe to cache matching result
const _currentDesktopsMatches = new Map();

// is:
// @name: desktop string you want to assert if it matches the current desktop env
//
// The function examples XDG_CURRENT_DESKTOP and return if the current desktop
// is part of that desktop string.
//
// Return value: if the environment isn't set or doesn't match, return False
// otherwise, return True.
function is(name) {
    if (!_currentDesktopsMatches.size) {
        const desktopsEnv = GLib.getenv('XDG_CURRENT_DESKTOP');
        if (!desktopsEnv) {
            _currentDesktopsMatches.set(name, false);
            return false;
        }

        const desktops = desktopsEnv.split(':');
        desktops.forEach(d => _currentDesktopsMatches.set(d, true));

        if (!_currentDesktopsMatches.size)
            _currentDesktopsMatches.set(name, _currentDesktopsMatches.has(name));
    }

    return !!_currentDesktopsMatches.get(name);
}
