export class FormatSanitizer {

    public static sanitize(formatString: String): String {
        try {
            FormatSanitizer.checkOpenBraces(formatString);
            const blocks: Array<String> = FormatSanitizer.divideBlocksWithMixedCharacters(FormatSanitizer.getFormatBlocks(formatString));
            return FormatSanitizer.sortFormatBlocks(blocks).join('');
        } catch (e) {
            throw new Error("Wrong format");
        }
    }

    private static getFormatBlocks(formatString: String): Array<String> {
        const blocks: Array<String> = new Array<String>();
        let currentBlock = '';
        let escape = false;

        for (let char of formatString.toCharArray()) {
            if (char === '\\') {
                if (!escape) {
                    escape = true;
                    currentBlock += char;
                    continue;
                }
            }

            if ((char === '[' || char === '{') && !escape) {
                if (!currentBlock.isEmpty()) {
                    blocks.push(currentBlock);
                }
                currentBlock = '';
            }

            currentBlock += char;

            if ((char === ']' || char === '}') && !escape) {
                blocks.push(currentBlock);
                currentBlock = '';
            }

            escape = false;
        }

        if (!currentBlock.isEmpty()) {
            blocks.push(currentBlock);
        }

        return blocks;
    }

    private static divideBlocksWithMixedCharacters(blocks: Array<String>): Array<String> {
        const resultingBlocks: Array<String> = new Array<String>();

        for (let block of blocks) {
            if (block.startsWith('[')) {
                let blockBuffer = '';
                for (let blockCharacter of block) {
                    if (blockCharacter === '[') {
                        blockBuffer += blockCharacter;
                        continue;
                    }

                    if (blockCharacter === ']' && !blockBuffer.endsWith('\\')) {
                        blockBuffer += blockCharacter;
                        resultingBlocks.push(blockBuffer);
                        break;
                    }

                    if (blockCharacter === '0' || blockCharacter === '9') {
                        if (
                            blockBuffer.contains('A')
                            || blockBuffer.contains('a')
                            || blockBuffer.contains('-')
                            || blockBuffer.contains('_')
                        ) {
                            blockBuffer += ']';
                            resultingBlocks.push(blockBuffer);
                            blockBuffer = `[${blockCharacter}`;
                            continue;
                        }
                    }

                    if (blockCharacter === 'A' || blockCharacter === 'a') {
                        if (
                            blockBuffer.contains('0')
                            || blockBuffer.contains('9')
                            || blockBuffer.contains('-')
                            || blockBuffer.contains('_')
                        ) {
                            blockBuffer += ']';
                            resultingBlocks.push(blockBuffer);
                            blockBuffer = `[${blockCharacter}`;
                            continue;
                        }
                    }

                    if (blockCharacter === '-' || blockCharacter == '_') {
                        if (
                            blockBuffer.contains('0')
                            || blockBuffer.contains('9')
                            || blockBuffer.contains('A')
                            || blockBuffer.contains('a')
                        ) {
                            blockBuffer += ']';
                            resultingBlocks.push(blockBuffer);
                            blockBuffer = `[${blockCharacter}`;
                            continue;
                        }
                    }

                    blockBuffer += blockCharacter;
                }
            } else {
                resultingBlocks.push(block);
            }
        }
        return resultingBlocks;
    }

    private static sortFormatBlocks(blocks: Array<String>): Array<String> {
        const sortedBlocks: Array<String> = new Array<String>();

        for (let block of blocks) {
            let sortedBlock: String;
            if (block.startsWith('[')) {
                if (block.contains('0') || block.contains('9')) {
                    block = block.replace(/\[/g, '')
                        .replace(/]/g, '');
                    sortedBlock = '[' + block
                        .toCharArray()
                        .sort()
                        .join('') + ']';
                } else if (block.contains('a') || block.contains('A')) {
                    block = block.replace(/\[/g, '')
                        .replace(/]/g, '');
                    sortedBlock = '[' + block
                        .toCharArray()
                        .sort()
                        .join('') + ']';
                } else {
                    block = block.replace(/\[/g, '')
                        .replace(/]/g, '')
                        .replace(/_/g, 'A')
                        .replace(/-/g, 'a');
                    sortedBlock = '[' + block
                        .toCharArray()
                        .sort()
                        .join('') + ']';
                    sortedBlock = sortedBlock
                        .replace(/A/g, '_')
                        .replace(/a/g, '-');
                }
            } else {
                sortedBlock = block;
            }

            sortedBlocks.push(sortedBlock);
        }

        return sortedBlocks;
    }

    private static checkOpenBraces(string: String): void | never {
        let escape = false;
        let squareBraceOpen = false;
        let curlyBraceOpen = false;

        for (let char of string.toCharArray()) {
            if (char === '\\') {
                escape = !escape;
                continue;
            }

            if (char === '[') {
                if (squareBraceOpen) {
                    throw new Error("Wrong format");
                }
                squareBraceOpen = !escape;
            }

            if (char === ']' && !escape) {
                squareBraceOpen = false;
            }

            if (char === '{') {
                if (curlyBraceOpen) {
                    throw new Error("Wrong format");
                }
                curlyBraceOpen = !escape;
            }

            if (char === '}' && !escape) {
                curlyBraceOpen = false;
            }

            escape = false;
        }
    }
}
