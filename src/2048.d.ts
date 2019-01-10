type Cells = [][]

interface keys{
  [key:string]:number
}

interface Vector {
  x: number,
  y: number
}

interface Traversals {
  x: number[]
  y: number[]
}

interface Window {
  [key:string]: any
}

interface Tile extends Vector {
  savePosition():void
  updatePosition(position:Vector):void
  serialize():void
  mergedFrom: any
  value: number
  position: Vector
  previousPosition: Vector
}

interface VectorMap  {
  [key:string]:Vector
}

interface Grid {
  cells: Cells
  empty():Vector[]
}
