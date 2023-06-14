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

interface Walkables {
    walkable?: string[] | null,
    ignore?: string[];
}

function findInTree(tree, filter, { walkable = null, ignore = [] }: Walkables = {}) {
    if (!tree || typeof tree !== "object") {
        return null;
    }

    if (typeof filter === "string") {
        if (Object.prototype.hasOwnProperty.call(tree, filter)) {
            return tree[filter];
        }

        return;
    } else if (filter(tree)) {
        return tree;
    }

    let returnValue = null;

    if (Array.isArray(tree)) {
        for (const value of tree) {
            returnValue = findInTree(value, filter, {
                walkable,
                ignore
            });

            if (returnValue) {
                return returnValue;
            }
        }
    } else {
        const walkables = !walkable ? Object.keys(tree) : walkable;

        for (const key of walkables) {
            if (!Object.prototype.hasOwnProperty.call(tree, key) || ignore.includes(key)) {
                continue;
            }

            returnValue = findInTree(tree[key], filter, {
                walkable,
                ignore
            });

            if (returnValue) {
                return returnValue;
            }
        }
    }

    return returnValue;
}

export const findInPixiJsStage = (tree: any, filter: (m: any) => void) =>
    findInTree(tree, filter, {
        walkable: ["children", "child"]
    });
