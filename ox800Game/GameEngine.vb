Public Class GameEngine

    Public Enum Direction
        Left
        Right
        Up
        Down
    End Enum

    Public WinNumber As Integer, Score = 0, StepCount = 0
    Public Width, Height As Integer
    Public Tiles(,) As Tile

    Sub New(w As Integer, h As Integer, Optional wn As Integer = &H800)
        Height = h
        Width = w
        WinNumber = wn
        ReDim Tiles(h, w)
        init()
    End Sub

    Public Sub init()
        For y = 0 To Height - 1
            For x = 0 To Width - 1
                Tiles(y, x) = New Tile()
            Next
        Next
    End Sub

    Public Function left() As Integer
        Dim ans = 0
        For y = 0 To Height - 1
            For x = 0 To Width - 1
                If Tiles(y, x).Number = 0 Then
                    ans += 1
                End If
            Next
        Next
        Return ans
    End Function

    Public Sub run(direction As Direction)
        StepCount += 1
        move(direction)
        'Console.ForegroundColor = ConsoleColor.Gray
        'Console.WriteLine("Before scan")
        'Render(Me)
        'Console.ReadKey()
        scan(direction)
        'Console.ForegroundColor = ConsoleColor.Gray
        'Console.WriteLine("After scan")
        'Render(Me)
        'Console.ReadKey()
        move(direction)
        genrandom()
        'Console.ForegroundColor = ConsoleColor.Gray
        'Console.WriteLine("After rand")
    End Sub

    Public Enum Status
        Normal
        Win
        Lose
    End Enum

    Public Function check() As Status
        Dim combineCount = 0
        For y = 0 To Height - 1
            For x = 0 To Width - 2
                If Tiles(y, x).Number = WinNumber Then
                    Return Status.Win
                End If
                If Tiles(y, x).Number = Tiles(y, x + 1).Number Then
                    combineCount += 1
                End If
            Next
        Next
        For x = 0 To Width - 1
            For y = 0 To Height - 2
                If Tiles(y, x).Number = WinNumber Then
                    Return Status.Win
                End If
                If Tiles(y, x).Number = Tiles(y + 1, x).Number Then
                    combineCount += 1
                End If
            Next
        Next
        If Tiles(Height - 1, Width - 1).Number = WinNumber Then
            Return Status.Win
        End If
        If combineCount > 0 OrElse left() > 0 Then
            Return Status.Normal
        Else
            Return Status.Lose
        End If
    End Function

    Public Sub genrandom()
        If left() <= 0 Then
            Return
        End If
        Dim rand As New Random
        Dim tile As Tile
        Do
            tile = Tiles(rand.Next(Height), rand.Next(Width))
        Loop While tile.Number <> 0
        tile.Number = IIf(rand.Next(2) = 1, 4, 2)
    End Sub

    Public Sub scan(direction As Direction)
        Select Case direction
            Case GameEngine.Direction.Down
                For x = 0 To Width - 1 '每一列,
                    For y = Height - 1 To 1 Step -1  '从倒数第一个开始，
                        If Tiles(y, x).Number = Tiles(y - 1, x).Number Then '如果和上面一个相等就合并
                            Tiles(y, x).Number += Tiles(y - 1, x).Number
                            Score += Tiles(y, x).Number
                            Tiles(y - 1, x) = New Tile()
                        End If
                    Next
                Next
            Case GameEngine.Direction.Left
                For y = 0 To Height - 1 '每一行,
                    For x = 0 To Width - 2   '从第一个开始，
                        If Tiles(y, x).Number = Tiles(y, x + 1).Number Then '如果和右面一个相等就合并
                            Tiles(y, x).Number += Tiles(y, x + 1).Number
                            Score += Tiles(y, x).Number
                            Tiles(y, x + 1) = New Tile()
                        End If
                    Next
                Next
            Case GameEngine.Direction.Right
                For y = 0 To Height - 1 '每一行,
                    For x = Width - 1 To 1 Step -1  '从倒数第一个开始，
                        If Tiles(y, x).Number = Tiles(y, x - 1).Number Then '如果和左面一个相等就合并
                            Tiles(y, x).Number += Tiles(y, x - 1).Number
                            Score += Tiles(y, x).Number
                            Tiles(y, x - 1) = New Tile()
                        End If
                    Next
                Next
            Case GameEngine.Direction.Up
                For x = 0 To Width - 1 '每一列,
                    For y = 0 To Height - 2 '从第一个开始，
                        If Tiles(y, x).Number = Tiles(y + 1, x).Number Then '如果和下面一个相等就合并
                            Tiles(y, x).Number += Tiles(y + 1, x).Number
                            Score += Tiles(y, x).Number
                            Tiles(y + 1, x) = New Tile()
                        End If
                    Next
                Next
            Case Else
                Throw New ArgumentException("A surprise to me")
        End Select
    End Sub


    Public Sub move(direction As Direction)
        Select Case direction
            Case GameEngine.Direction.Down
                For x = 0 To Width - 1 '每一列,
                    For y = Height - 1 To 0 Step -1  '从倒数第一个开始，
                        If Tiles(y, x).Number = 0 Then
                            Continue For
                        End If
                        Dim curry = y
                        Do While curry < Height - 1 AndAlso Tiles(curry + 1, x).Number = 0 '每个向下移动直到卡住
                            Tiles(curry + 1, x) = Tiles(curry, x)
                            Tiles(curry, x) = New Tile()
                            curry += 1
                            'Render(Me)
                            'Console.ReadKey()
                        Loop
                    Next
                Next
            Case GameEngine.Direction.Left
                For y = 0 To Height - 1 '每一行,
                    For x = 0 To Width - 1  '从第一个开始，
                        If Tiles(y, x).Number = 0 Then
                            Continue For
                        End If
                        Dim currx = x
                        Do While currx > 0 AndAlso Tiles(y, currx - 1).Number = 0 '每个向左移动直到卡住
                            Tiles(y, currx - 1) = Tiles(y, currx)
                            Tiles(y, currx) = New Tile()
                            currx -= 1
                            'Render(Me)
                            'Console.ReadKey()
                        Loop
                    Next
                Next
            Case GameEngine.Direction.Right
                For y = 0 To Height - 1 '每一行,
                    For x = Width - 1 To 0 Step -1  '从倒数第一个开始，
                        If Tiles(y, x).Number = 0 Then
                            Continue For
                        End If
                        Dim currx = x
                        Do While currx < Width - 1 AndAlso Tiles(y, currx + 1).Number = 0 '每个向右移动直到卡住
                            Tiles(y, currx + 1) = Tiles(y, currx)
                            Tiles(y, currx) = New Tile()
                            currx += 1
                            'Render(Me)
                            'Console.ReadKey()
                        Loop
                    Next
                Next
            Case GameEngine.Direction.Up
                For x = 0 To Width - 1 '每一列,
                    For y = 0 To Height - 1  '从第一个开始，
                        If Tiles(y, x).Number = 0 Then
                            Continue For
                        End If
                        Dim curry = y
                        Do While curry > 0 AndAlso Tiles(curry - 1, x).Number = 0 '每个向上移动直到卡住
                            Tiles(curry - 1, x) = Tiles(curry, x)
                            Tiles(curry, x) = New Tile()
                            curry -= 1
                            'Render(Me)
                            'Console.ReadKey()
                        Loop
                    Next
                Next
            Case Else
                Throw New ArgumentException("A surprise to me")
        End Select
    End Sub

End Class
