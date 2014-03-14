Public Class Tile

    Public Number As UInteger = 0
    'Public Color As ConsoleColor = ConsoleColor.Black

    Public Shared ColorMap As New Dictionary(Of UInteger, ConsoleColor) From {
        {&H0, ConsoleColor.Black},
        {&H1, ConsoleColor.DarkGray},
        {&H2, ConsoleColor.DarkGray},
        {&H4, ConsoleColor.Gray},
        {&H8, ConsoleColor.Gray},
        {&H10, ConsoleColor.White},
        {&H20, ConsoleColor.White},
        {&H40, ConsoleColor.DarkBlue},
        {&H80, ConsoleColor.Blue},
        {&H100, ConsoleColor.DarkGreen},
        {&H200, ConsoleColor.Green},
        {&H400, ConsoleColor.DarkYellow},
        {&H800, ConsoleColor.Yellow},
        {&H1000, ConsoleColor.DarkCyan},
        {&H2000, ConsoleColor.Cyan},
        {&H4000, ConsoleColor.DarkMagenta},
        {&H8000, ConsoleColor.Magenta},
        {&H10000, ConsoleColor.DarkRed},
        {&H20000, ConsoleColor.Red},
        {&H40000, ConsoleColor.Red},
        {&H80000, ConsoleColor.Red},
        {&H100000, ConsoleColor.Red},
        {&H200000, ConsoleColor.Red},
        {&H400000, ConsoleColor.Red},
        {&H800000, ConsoleColor.Red},
        {&H1000000, ConsoleColor.Red},
        {&H2000000, ConsoleColor.Red},
        {&H4000000, ConsoleColor.Red},
        {&H8000000, ConsoleColor.Red},
        {&H10000000, ConsoleColor.Red},
        {&H20000000, ConsoleColor.Red},
        {&H40000000, ConsoleColor.Black}
    }
End Class
