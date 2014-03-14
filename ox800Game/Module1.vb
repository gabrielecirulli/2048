Module Module1

    Const NumberLength = 8 '4
    Const NumberBase = 2 '16
    Const WinNumber = 2048

    Dim ge As GameEngine

    Sub Main()
        Console.Title = "Join the numbers and get to the " & WinNumber.ToString() & " tile! Careful: this game is extremely addictive!"
        Do While True
            Welcome()
            GameMain()
        Loop
    End Sub

    Public Sub Welcome()
        Console.Clear()
        Console.ForegroundColor = ConsoleColor.Gray
        Console.WriteLine("Join the numbers and get to the {0} tile!", WinNumber)
        Console.ForegroundColor = ConsoleColor.Red
        Console.WriteLine("Careful: this game is extremely addictive!")
        Console.ForegroundColor = ConsoleColor.Gray
        Console.WriteLine("HOW TO PLAY: Use your arrow keys to move the tiles. ")
        Console.WriteLine("When two tiles with the same number touch, they merge into one!")
        Console.WriteLine("Press `a' to view information,")
        Console.WriteLine("press other keys to start game,")
        Do While True
            Dim ki = Console.ReadKey(True)
            Select Case ki.Key
                Case ConsoleKey.A
                    Console.WriteLine("INFORMATION: ")
                    Console.WriteLine("Welcome to http://twd2.me/")
                Case Else
                    Return
            End Select
        Loop
    End Sub

    Public Sub GameMain()
        ge = New GameEngine(4, 4)
        ge.genrandom()
        ge.genrandom()
        Console.Clear()
        Render(ge)
        Do While True
            Dim ki = Console.ReadKey(True)
            Console.Clear()
            Select Case ki.Key
                Case ConsoleKey.DownArrow
                    ge.run(GameEngine.Direction.Down)
                Case ConsoleKey.LeftArrow
                    ge.run(GameEngine.Direction.Left)
                Case ConsoleKey.RightArrow
                    ge.run(GameEngine.Direction.Right)
                Case ConsoleKey.UpArrow
                    ge.run(GameEngine.Direction.Up)
                Case Else
                    Console.ForegroundColor = ConsoleColor.Gray
                    Console.WriteLine("Wrong key")
            End Select
            PrintInfo()
            Render(ge)
            Dim status = ge.check()
            Select Case status
                Case GameEngine.Status.Lose
                    GameLose()
                    Return
                Case GameEngine.Status.Normal
                Case GameEngine.Status.Win
                    GameWin()
                    Return
                Case Else
                    Throw New ArgumentException("A surprise to me")
            End Select
        Loop
    End Sub

    Public Sub PrintInfo()
        Console.ForegroundColor = ConsoleColor.Gray
        Console.WriteLine("Score: {0}, Step: {1}", ge.Score, ge.StepCount)
    End Sub

    Public Sub GameEnd()
        Console.ForegroundColor = ConsoleColor.Gray
        Console.WriteLine("Press `r' to restart game, ")
        Console.WriteLine("press `q' to quit.")
        Do While True
            Dim ki = Console.ReadKey(True)
            Select Case ki.Key
                Case ConsoleKey.R
                    Return
                Case ConsoleKey.Q
                    Environment.Exit(0)
                Case Else
                    Console.ForegroundColor = ConsoleColor.Gray
                    Console.WriteLine("Wrong key")
            End Select
        Loop
    End Sub


    Public Sub GameLose()
        Console.ForegroundColor = ConsoleColor.Yellow
        Console.WriteLine("LOSE :( Score is {0}, used {1} steps", ge.Score, ge.StepCount)
        GameEnd()
    End Sub

    Public Sub GameWin()
        Console.ForegroundColor = ConsoleColor.Yellow
        Console.WriteLine("WIN!!! Score is {0}, used {1} steps", ge.Score, ge.StepCount)
        GameEnd()
    End Sub

    Public Sub Render(ge As GameEngine)
        For y = 0 To ge.Height - 1
            For x = 0 To ge.Width - 1
                Dim num = Convert.ToString(ge.Tiles(y, x).Number, NumberBase)
                Dim padd = New String("0", NumberLength - num.Length)
                Console.ForegroundColor = Tile.ColorMap(ge.Tiles(y, x).Number)
                Console.Write("{0}{1} ", padd, num)
            Next
            Console.WriteLine()
        Next
    End Sub

End Module
