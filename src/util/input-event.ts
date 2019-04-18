declare module 'inputEvent' {
    interface InputEvent extends Event {
        inputType: 'deleteContentForward' | 'deleteContentBackward' | 'insertText';
    }
}
