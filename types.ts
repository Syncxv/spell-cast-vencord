/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export interface Letter {
    id: number;
    display?: string;
    row: number;
    collumn: number;

    value: number;

    letterMulti: number;
    wordMulti: boolean;

    block_letter: false;
    clone: () => Letter;

    getLetterMultiplier: () => number;
    getWordMultiplier: () => number;
    hasMultiplier: () => boolean;

    multipliers: number[];
}

export interface Network {
    initialized: boolean,
    on: (key: number, callback: (...data: any[]) => void, owner: any) => void;
    send: (key: number) => void;
}


export interface Board {
    showHint: (letters: Letter[]) => void,
    boardData: {
        getAllLettersList: () => Letter[];
        wordMultiplierPosition: { collumn: number, row: number; };
    };
}

export interface GameState {
    isInTheLead: boolean;
    isLocked: boolean;
    isMyTurn: boolean;
}
