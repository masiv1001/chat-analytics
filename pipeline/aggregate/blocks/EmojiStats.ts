import { Index } from "@pipeline/Types";
import { BlockDescription, BlockFn, IndexEntry } from "@pipeline/aggregate/Blocks";
import { parseAndFilterMessages } from "@pipeline/aggregate/Helpers";
import { MessageView } from "@pipeline/serialization/MessageView";

export interface EmojiStats {
    emojisCount: number[];
}

const fn: BlockFn<EmojiStats> = (database, filters, common) => {
    const emojisCount = new Array(database.emojis.length).fill(0);

    const processMessage = (msg: MessageView, channelIndex: Index) => {
        const emojis = msg.getEmojis();
        if (emojis) {
            for (const emoji of emojis) {
                emojisCount[emoji[0]] += emoji[1];
            }
        }
    };

    parseAndFilterMessages(processMessage, database, filters);

    return {
        emojisCount,
    };
};

export default {
    key: "emoji-stats",
    triggers: ["authors", "channels", "time"],
    fn,
} as BlockDescription<"emoji-stats", EmojiStats>;