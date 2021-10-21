package com.bigescape.manager.fire;

public enum FireType {
    START, END;

    public FireType next() {
        return this.equals(FireType.START) ? FireType.END : FireType.START;
    }
}
