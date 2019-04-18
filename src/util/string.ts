export {};

declare global {
    interface String {
        isDigit(): boolean;
        isLetter(): boolean;
        isLetterOrDigit(): boolean;
        contains(char: String): boolean;
        isEmpty(): boolean;
        first(): String;
        toCharArray(): Array<String>;
        prefixIntersection(another: String): String;
    }
}

String.prototype.isDigit = function (): boolean {
    return this.search(/^[0-9]$/g) !== -1;
};

String.prototype.isLetter = function (): boolean {
    return this.search(/^[0-9]$/g) === -1;
};

String.prototype.isLetterOrDigit = function (): boolean {
  return this.isDigit() || this.isLetter();
};

String.prototype.contains = function (char: String): boolean {
    return this.search(char) !== -1;
};

String.prototype.isEmpty = function (): boolean {
    return this.length === 0;
};

String.prototype.first = function (): String {
    return this.charAt(0);
};

String.prototype.toCharArray = function (): Array<String> {
    return this.split('');
};

String.prototype.prefixIntersection = function (another: String): String {
    if (this.isEmpty() || another.isEmpty()) return '';

    let endIndex = 0;
    while (endIndex < this.length && endIndex < another.length) {
        if (this[endIndex] === another[endIndex]) {
            ++endIndex;
        } else {
            return this.substring(0, endIndex);
        }
    }

    return this.substring(0, endIndex);
};

