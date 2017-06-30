declare namespace globalJson
{
    interface RootObject
    {
        debugDraw: boolean;
        editorJson?: EditorJson;
        dropAreaPositions: DropAreaPosition[];
        homePositions: DropAreaPosition[];
        numbers: Number[];
        symbols: Symbol[];
        fullScreen: boolean;
        ResHeight: number;
        ResWidth: number;
        startingArea: StartingArea;
    }

    interface StartingArea
    {
        width: number;
        height: number;
        x: number;
        y: number;
    }

    interface Symbol
    {
        symbolValue: string;
    }

    interface Number
    {
        numberValue: number;
    }

    interface DropAreaPosition
    {
        x: number;
        y: number;
    }

    interface EditorJson
    {
        active: boolean;
        height: number;
    }
}

