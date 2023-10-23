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

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { copyWithToast } from "@utils/misc";
import { canonicalizeReplacement } from "@utils/patches";
import definePlugin, { OptionType, PatchReplacement } from "@utils/types";
import { waitFor } from "plugins/imageZoom/utils/waitFor";

import { Solver } from "./Solver";
import { Board, GameState, Letter, Network } from "./types";
import * as constants from "./utils/constants";
import { convertToMatrix } from "./utils/convertToMatrix";
import { findInPixiJsStage } from "./utils/findInPixiJsStage";
import { sortLetters } from "./utils/sortLetters";
import { uuidv4 } from "./utils/v4";
export const settings = definePluginSettings({
    shouldPatchIframe: {
        type: OptionType.BOOLEAN,
        description: "should patch i frame"
    }
});
interface SearchParams {
    instance_id: string,
    channel_id: string;
    guild_id: string;
}



export default definePlugin({
    name: "SpellCastWordThingy",
    description: "copy grid of words spell cast",
    authors: [Devs.Aria],

    patches: [
        {
            find: "},sandbox:",
            replacement: [
                // https://regex101.com/r/NOKXdt/1
                {
                    match: /(\(.{1,2}\){)var((?<urlVar>.{1,3})=.{1,2}\.url),(?<middle>.{1,900}),(?<iframeBlock>(?<iframeIdVar>.{1,2})=\(0,.{1,2}\.useMemoOne\).{1,50}\.Z\)\(\)}\),)\[.{1,20}\]\),(?<rest>.{1,900}POPOUT_CLOSE\))/,
                    replace: "$1 const [$<urlVar>, setUrl] = Vencord.Webpack.Common.React.useState($self.settings.store.shouldPatchIframe ? null : e.url); let $<middle>; let $<iframeBlock>[]); Vencord.Webpack.Common.React.useEffect(() => {$self.patchIframe(e.url, $<iframeIdVar>, e.queryParams).then((url) => url != null && setUrl(url))}, []); let $<rest>"
                },

                {
                    match: /src:(""\.concat\((.{1,3}),.{1,50}\)\))/,
                    replace: "src:$self.settings.store.shouldPatchIframe ? $2 : $1"
                },

                // {
                //     match: /null==.{1,2}\?window:.{1,2}\)/,
                //     replace: "window)"
                // }
            ]
        },

        // {
        //     find: '"Invalid Origin")',
        //     replacement: {
        //         match: /;if\(null==\i\|\|!\i\(\i,\[\i\]\)\).{1,500}"Invalid Origin"\)/,
        //         replace: ";"
        //     }
        // }

        {
            find: ".parseToAST(",
            replacement: {
                match: /t\.indexOf\(e\)>-1/,
                replace: "true"
            }
        }
    ],

    settings,

    url: null as string | null,
    spellCast: null as string | null,
    iframeId: null as string | null,

    nextWords: 1,

    _network: null as Network | null,
    validWordSet: null as Set<string> | null,
    combos: null as { score: number; word: Letter[]; }[][] | null,

    findInPixiJsStage,
    // useMemoOne: coolReact.useMemoOne,
    v4: uuidv4,
    constants,


    get element(): HTMLIFrameElement | null {
        return document.querySelector('iframe[src^="blob:"');
    },

    get window() {
        return this.element?.contentWindow;
    },

    get board(): Board | undefined {
        if (!this.window) return;
        let board: Board | undefined;

        if (board) {
            if (!board?.boardData?.getAllLettersList()?.length)
                return { board } = findInPixiJsStage(this.window.stage, e => e.board);
            return board;
        }
        board = findInPixiJsStage(this.window.stage, e => e.board)?.board;

        return board;
    },


    get gameState(): GameState | undefined {
        if (!this.window) return;
        let state: GameState | undefined;

        if (!state)
            state = findInPixiJsStage(this.window.stage, e => e.playerState);

        return state;
    },

    get solver() {
        if (!this.window || !this.board || !this.validWordSet) return;

        let solver: Solver | null = null;

        if (!solver) {
            const grid = convertToMatrix<Letter>(this.board.boardData.getAllLettersList().sort(sortLetters), 5);
            solver = new Solver({ grid, validWordsSet: this.validWordSet });
        }

        if (solver.grid.length && solver.grid[0][0] !== this.board.boardData.getAllLettersList().find(m => m.collumn === 0 && m.row === 0)) {
            console.log("updating grid");
            solver.grid = convertToMatrix<Letter>(this.board.boardData.getAllLettersList().sort(sortLetters), 5);
        }

        return solver;
    },

    set network(network: Network) {
        this._network = network;
        this.doNetworkStuff(network);
    },

    get network(): Network | null {
        return this._network;
    },

    async start() {
        const words = await (await fetch("https://spell.daveyy.net/wordlist.txt")).text();
        this.validWordSet = new Set(words.split("\n").map(l => l.replace(/[\r]/g, "").toLowerCase()));
    },


    async patchIframe(baseUrl: string, iframeId: string, searchParams: SearchParams) {
        if (!settings.store.shouldPatchIframe || !baseUrl.includes("852509694341283871")) return baseUrl;
        const url = "".concat(baseUrl, "?").concat(new URLSearchParams({ ...searchParams, frame_id: iframeId, platform: "desktop" }) as any);
        this.spellCast = await (await fetch(url, { mode: "no-cors" })).text();

        this.patchSpellCast({ match: /"(\/coeus.{1,20})"/, replace: `"${baseUrl}$1"` });
        this.patchSpellCast({ match: /web_url = (.{1,50})/g, replace: `web_url = "${baseUrl}"` });
        this.patchSpellCast({ match: /web_url =\n((.|\n){1,150}void 0)/, replace: `web_url = "${baseUrl}"` });
        this.patchSpellCast({ match: /document\.location\.href/g, replace: `"${baseUrl}"` });
        this.patchSpellCast({ match: /vpath.?=.{1,100}(,|;)/g, replace: `vpath="${baseUrl}/"$1` });
        this.patchSpellCast({ match: /return window\.location\.href="https:\/\/"\+Config\.domain/, replace: "" });

        // spellCast = spellCast.replace(/(XMLHttpRequest\.prototype\.open=function\(.{1,15}\){)/, "$1console.log(arguments);");
        // spellCast = spellCast.replace(/Ie\.show\(i,a\)/, "debugger;");
        // spellCast = spellCast.replace(/l\.close\(a,"Authentication or authorization failure"\)/, "console.log(\"welp\")");
        // spellCast = spellCast.replace(/(return Zt\.parse\(yield t\({)/, "debugger;$1");
        // this.patchSpellCast({ match: /window\.XIO\.autoConnect\(n,e\)/, replace: " (() => { debugger; })()" });
        // this.patchSpellCast({ match: /(.\("getMyData",)/, replace: "console.log(arguments);$1" });
        this.patchSpellCast({ match: /\i\.get\("frame_id"\);/, replace: `"${iframeId}";` });
        this.patchSpellCast({ match: /\i\.get\("platform"\);/, replace: "\"desktop\";" });
        this.patchSpellCast({ match: /\i\.get\("instance_id"\);/, replace: `"${searchParams.instance_id}";` });
        this.patchSpellCast({ match: /\i\.get\("guild_id"\)/, replace: `"${searchParams.guild_id}"` });
        this.patchSpellCast({ match: /\i\.get\("channel_id"\)/, replace: `"${searchParams.channel_id}"` });
        this.patchSpellCast({ match: /(\/hermes-cred\/discord-client-cred\/auth)/, replace: `${baseUrl}$1` });
        this.patchSpellCast({ match: /(\/hermes-cred\/discord-client-cred\/refresh)/, replace: `${baseUrl}$1` });
        // spellCast = spellCast.replace(/(\[this\.source,this\.sourceOrigin\]=\[.{1,70},)(.{1,50}")/, `$1"${url}"`);

        this.patchSpellCast({
            match: /,(?<let>.{1,2})=({callbacks:{},)/,
            replace: ";let $<let> = parent.$self.network = $2"
        });

        this.patchSpellCast({
            match: /var (\i)=({objPools:{},)/,
            replace: "; let $1 = parent.$self.ui = $2"
        });

        this.patchSpellCast({
            match: /var (\i)=(\{gameWidth)/,
            replace: "; let $1 = parent.$self.utils = $2"
        });
        console.log(iframeId, searchParams);
        const blob = new Blob(
            [
                this.spellCast
            ],
            { type: "text/html" }
        );
        this.url = URL.createObjectURL(blob);
        return this.url;
    },

    patchSpellCast(replacement: PatchReplacement) {
        canonicalizeReplacement(replacement, this.name);

        this.spellCast = this.spellCast!.replace(replacement.match, replacement.replace as string);
    },

    patchHintButton() {
        if (this.board == null) return;
        const hintContainer = findInPixiJsStage(this.window.stage, e => e.powerupType === "HINT");
        const that = this;
        hintContainer.button.onClick = function () {
            const word = that.nextHeighestValueWord();
            if (!word) return;
            that.board!.deselectAll();
            that.board!.showHint(word);
        };
    },


    nextHeighestValueWord() {
        if (!this.combos) this.createHintCombos();

        if (!this.combos) return null;

        let largestWords = this.combos!.at(-this.nextWords)!;
        if (!largestWords.length) {
            this.nextWords++;
            largestWords = this.combos!.at(-this.nextWords)!;
        }

        return largestWords!.shift()!.word;
    },


    createHintCombos() {
        if (!this.solver || !this.board?.boardData.getAllLettersList().length) return;
        this.combos = this.solver.getAllCombinations().map((words, i) =>
            words.map(word => {
                const score = this.calculateScore(word);
                return {
                    score,
                    word,
                };
            }).sort((a, b) => a.score - b.score).reverse()
        ).filter(e => e.length);

    },

    calculateScore(letters: Letter[]) {
        const { wordMultiplierPosition } = this.board!.boardData; // the position that multiplies the word's score, replace {...} with actual value
        let score = 0;
        let multiplier = 0;

        if (letters) {
            for (let i = 0; i < letters.length; i++) {
                score += letters[i].value * letters[i].getLetterMultiplier();

                if (wordMultiplierPosition &&
                    wordMultiplierPosition.collumn === letters[i].collumn &&
                    wordMultiplierPosition.row === letters[i].row) {
                    multiplier += 2;
                }

                if (letters[i].getWordMultiplier() > 1) {
                    multiplier += letters[i].getWordMultiplier();
                }
            }

            // Add other game-specific conditions here

            if (multiplier > 1) {
                score *= multiplier;
            }
        }

        return score;
    },


    doNetworkStuff(network: Network) {
        let patchedButtons = false;
        waitFor(() => this.window && this.board && this.gameState && this.window.XS.initComplete && network.initialized, () => {
            console.log("hi");
            network.on(constants.networkThingies.newTurn, () => {
                if (!patchedButtons) {
                    this.patchHintButton();
                    this.addButton();
                    patchedButtons = true;
                }
                if (this.gameState!.isMyTurn) {
                    console.log("new turn GANG AGN AGN AGNAG");
                    this.nextWords = 1;
                    this.createHintCombos();
                }
            }, this.board);

            network.on(constants.networkThingies.boosterUsed, () => {
                console.log("shuffled eh");
                this.nextWords = 1;
                this.createHintCombos();
            }, this.board);
        });

    },



    addButton() {
        const padding = 50;
        const BOARD_CONTAINER = findInPixiJsStage(this.window.stage, e => e?.progressBarBlue).parent.parent;

        const button = new this.window.Graphics();
        button.beginFill(0x0000FF);
        button.drawRoundedRect(0, 0, 150, 50, 10);
        button.endFill();
        button.position.x = BOARD_CONTAINER.position.x + BOARD_CONTAINER.width / 2;
        button.position.y = this.utils.gameHeight() - (button.height * 1.75) - padding;



        button.interactive = true;

        button.mousedown = button.touchstart = data => {
            this.alpha = 0.5;
            console.log("YOU CLICCKED ME", data);
            this.copyGrid();
        };

        button.mouseup = button.mouseupoutside = button.touchend = button.touchendoutside = function () {
            this.alpha = 1;
        };

        button.mouseover = function () {
            this.alpha = 0.8;
        };

        button.mouseout = function () {
            this.alpha = 1;
        };

        const text = new this.window.Text2(this.window.Host.Localize.Translate("Copy"), { fill: "#FFFFFF", size: 32 });
        text.anchor.set(0.5);
        text.x = button.width / 2;
        text.y = button.height / 2;
        button.addChild(text);

        this.window.stage.addChild(button);

        button.scale.x = 2;
        button.scale.y = 2;

        this.button = button;

    },


    copyGrid() {
        if (!this.board || !this.board.boardData.getAllLettersList().length) return;
        const boardLetters = this.board.boardData.getAllLettersList()
            .sort(sortLetters)
            .map(m => m.display)
            .join("");

        const letterMulti = this.board.boardData.getAllLettersList().find(m => m.hasMultiplier());

        const wordMulti = this.board.boardData.wordMultiplierPosition != null && this.board.boardData.wordMultiplierPosition;

        const data = {
            letterMulti: {
                ...(letterMulti != null && {
                    col: letterMulti.collumn,
                    row: letterMulti.row,
                    multi: letterMulti?.getLetterMultiplier()
                })
            },
            ...(wordMulti && { wordMulti: { col: wordMulti.collumn, row: wordMulti.row } })
        };


        copyWithToast(`${boardLetters}|${JSON.stringify(data)}`, "COPPIED");
    }

});



