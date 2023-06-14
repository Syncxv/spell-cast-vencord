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

class TrieNode<T> {
    value: T;
    children: { [key: string]: TrieNode<T>; };
    isEndOfWord: boolean;

    constructor(value: any = null) {
        this.value = value;
        this.children = {};
        this.isEndOfWord = false;
    }
}

export class Trie<T> {
    root: TrieNode<T>;
    constructor() {
        this.root = new TrieNode();
    }

    insert(key: string, value: T) {
        let node = this.root;
        for (const char of key) {
            if (!(char in node.children)) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.value = value;
    }

    exists(query: string): boolean {
        let node = this.root;
        for (const char of query) {
            if (!(char in node.children)) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

    search(query: string) {
        let node = this.root;
        for (const char of query) {
            if (!(char in node.children)) {
                return [];
            }
            node = node.children[char];
        }
        return this._dfs(node);
    }

    _dfs(node: TrieNode<T>): T[] {
        let result: T[] = [];
        if (node.isEndOfWord) {
            result.push(node.value);
        }
        for (const child in node.children) {
            result = result.concat(this._dfs(node.children[child]));
        }
        return result;
    }
}
