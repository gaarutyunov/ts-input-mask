declare module 'input-event' {
    interface InputEvent extends Event {
        inputType: 'deleteContentForward' | 'deleteContentBackward' | 'insertText';
    }
}
