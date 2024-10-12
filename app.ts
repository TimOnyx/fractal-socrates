class Coordinate {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  hasExploded(): boolean {
    const {x, y} = this;
    return Math.sqrt(x * x + y * y) > 2;
  }

  square(): Coordinate {
    const {x, y} = this;
    const realPart = x * x - y * y;
    const imaginaryPart = 2 * x * y;
    return new Coordinate(realPart, imaginaryPart);
  }
}

const calculateWhenExploded = (inputCoordinate: Coordinate) => {
  let state: Coordinate = new Coordinate(0, 0);
  for (let index = 0; index < 100; index++) {
    const nextCoordinate = calculateNextPoint(state, inputCoordinate);
    state = nextCoordinate;
    const {x, y} = state;
    if (state.hasExploded()) {
      return index;
    }
  }

  return 101;
};

const calculateNextPoint = (previousCoordinate: Coordinate, inputCoordinate: Coordinate): Coordinate => {
  const squaredCoordinate = previousCoordinate.square();
  return new Coordinate(
    squaredCoordinate.x + inputCoordinate.x,
    squaredCoordinate.y + inputCoordinate.y,
  );
};

class Canvas {
  public ctx: CanvasRenderingContext2D | null;
  private width: number = 400;
  private height: number = 400;
  private xOffset: number = 300;
  private yOffset: number = 100;
  constructor() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    this.ctx = canvas?.getContext('2d') || null;
  }

  drawPixel(x: number, y: number, color: string): void {
    if (!this.ctx) {
      console.log('Canvas context not found in drawPixel');
      return;
    }
    
    const mappedX = (x + 1) * this.width / 2 + this.xOffset;
    const mappedY = (y + 1) * this.height / 2 + this.yOffset;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(mappedX, mappedY, 1, 1);
  }
}

const interpolate = (start: number, end: number, factor: number): number => {
  return Math.round(start + (end - start) * factor);
}

const interpolateColor = (color1: number[], color2: number[], factor: number): string => {
  const r = interpolate(color1[0], color2[0], factor);
  const g = interpolate(color1[1], color2[1], factor);
  const b = interpolate(color1[2], color2[2], factor);
  return `rgb(${r}, ${g}, ${b})`;
}

let fill = 'black';
let redMethod = 'multiply';
let redFactor = 1;
let greenMethod = 'multiply';
let greenFactor = 1;
let blueMethod = 'multiply';
let blueFactor = 1;

const getFromInput = () => {
  const form = document.forms.namedItem('input');
  fill = (form?.elements.namedItem('fill') as HTMLInputElement)?.value || fill;
  redMethod = (form?.elements.namedItem('red-method') as HTMLInputElement)?.value || redMethod;
  redFactor = parseFloat((form?.elements.namedItem('red-factor') as HTMLInputElement)?.value || '1');
  greenMethod = (form?.elements.namedItem('green-method') as HTMLInputElement)?.value || greenMethod;
  greenFactor = parseFloat((form?.elements.namedItem('green-factor') as HTMLInputElement)?.value || '1');
  blueMethod = (form?.elements.namedItem('blue-method') as HTMLInputElement)?.value || blueMethod;
  blueFactor = parseFloat((form?.elements.namedItem('blue-factor') as HTMLInputElement)?.value || '1');
}

const calculateColor = (explodedAt: number): string => {
  if (explodedAt === 101) {
    return fill;
  }

  const red = redMethod === 'pow' ? Math.pow(explodedAt, redFactor) : explodedAt * redFactor;
  const green = greenMethod === 'pow' ? Math.pow(explodedAt, greenFactor) : explodedAt * greenFactor;
  const blue = blueMethod === 'pow' ? Math.pow(explodedAt, blueFactor) : explodedAt * blueFactor;
  return `rgb(${red}, ${green}, ${blue})`;
}

let canvas: Canvas;

const draw = () => {
  getFromInput();
  const stepSize = 0.005;
  for (let x = -2.5; x < 2; x += stepSize) {
    for (let y = -2; y < 2; y += stepSize) {
      const input = new Coordinate(x, y);
      const explodedAt = calculateWhenExploded(input);
      
      canvas.drawPixel(x, y, calculateColor(explodedAt));
    }
  }
}

const init = () => {
  canvas = new Canvas();
  draw();
  document.getElementById('apply')?.addEventListener('click', draw);
}

init();