package me.yesd.Utilities;

public enum ObjectTypes {
    Beach(33);
    private int type;
        ObjectTypes(int type){

            this.type = type;
        }

    public int getType() {
        return type;
    }
}
