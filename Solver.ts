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

import type { Letter } from "./types";
import { directions, size } from "./utils/constants";
import { Trie } from "./utils/Trie";

interface Props {
    grid: Letter[][];
    validWordsSet: Set<string>;
}
export class Solver {
    grid: Letter[][];
    size: number;
    validWordsSet: Set<string>;
    validWordsTrie: Trie<string>;

    constructor({ grid, validWordsSet }: Props) {
        this.grid = grid;
        this.size = size;
        this.validWordsSet = validWordsSet;

        this.validWordsTrie = new Trie<string>();

        for (const word of validWordsSet) {
            this.validWordsTrie.insert(word.toLowerCase(), word);
        }
    }

    getCombinations(
        row: number,
        col: number,
        visited: boolean[][],
        combination: Letter[],
        allCombinations: Letter[][],
        desired: number
    ) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size || visited[row][col]) {
            return;
        }

        visited[row][col] = true;

        // add the letter at this cell to the combination
        combination.push(this.grid[row][col]);

        const word = combination
            .map(s => s.display)
            .join("")
            .toLowerCase();

        // if the combination is of the desired length, add it to the allCombinations list
        if (combination.length === desired) {
            const results = this.validWordsTrie.search(word);
            if (results[0] === word) {
                allCombinations.push(combination.slice());
            }
        } else {
            if (!this.validWordsTrie.startsWith(word)) {
                combination.pop();
                visited[row][col] = false;
                return;
            }
            for (const [dx, dy] of Object.values(directions)) {
                this.getCombinations(row + dx, col + dy, visited, combination, allCombinations, desired);
            }
        }

        combination.pop();
        visited[row][col] = false;
    }

    getCombinationsRecursive(n = 4) {
        const allCombinations: Letter[][] = [];
        const combination: Letter[] = [];
        const visited = Array(this.size)
            .fill(false)
            .map(() => Array<boolean>(this.size).fill(false));

        // start the recursive process from each cell in the grid
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.getCombinations(row, col, visited, combination, allCombinations, n);
            }
        }

        return allCombinations;
    }


    getAllCombinations(n = 11) {
        const res: Letter[][][] = [];
        for (let i = 2; i < n; ++i) {
            res.push(this.getCombinationsRecursive(i));
        }
        return res;
    }
}
