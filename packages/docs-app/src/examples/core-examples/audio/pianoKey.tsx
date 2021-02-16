/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import React, { useEffect } from "react";

import { Classes } from "@blueprintjs/core";

import { Envelope } from "./envelope";
import { Oscillator } from "./oscillator";
import { Scale } from "./scale";

interface IPianoKeyProps {
    note: string;
    hotkey: string;
    pressed: boolean;
    context: AudioContext | undefined;
}

export const PianoKey: React.FC<IPianoKeyProps> = ({ context, hotkey, note, pressed }) => {
    let oscillator: Oscillator;
    let envelope: Envelope;

    if (context !== undefined) {
        oscillator = new Oscillator(context, Scale[note]);
        envelope = new Envelope(context);
        oscillator.oscillator.connect(envelope.gain);
        envelope.gain.connect(context.destination);
    }

    useEffect(() => {
        if (pressed) {
            envelope?.on();
        } else {
            envelope?.off();
        }
        return () => envelope?.off();
    }, [envelope, pressed]);

    const classes = classNames("piano-key", {
        "piano-key-pressed": pressed,
        "piano-key-sharp": /\#/.test(note),
    });
    const elevation = classNames(pressed ? Classes.ELEVATION_0 : Classes.ELEVATION_2);
    return (
        <div className={classes}>
            <div className={elevation}>
                <div className="piano-key-text">
                    <span className="piano-key-note">{note}</span>
                    <br />
                    <kbd className="piano-key-hotkey">{hotkey}</kbd>
                </div>
            </div>
        </div>
    );
};