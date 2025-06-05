import dotTypes from "../../constants/dotTypes";
import { DotType, GetNeighbor, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs, Window } from "../../types";

export default class QRDot {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: DotType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: DotType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case dotTypes.dots:
        drawFunction = this._drawDot;
        break;
      case dotTypes.classy:
        drawFunction = this._drawClassy;
        break;
      case dotTypes.classyRounded:
        drawFunction = this._drawClassyRounded;
        break;
      case dotTypes.rounded:
        drawFunction = this._drawRounded;
        break;
      case dotTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case dotTypes.duttonCarIcon:
        drawFunction = this._drawDuttonCarIcon;
        break;
      case dotTypes.square:
      default:
        drawFunction = this._drawSquare;
    }

    drawFunction.call(this, { x, y, size, getNeighbor });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._element.setAttribute("cx", String(x + size / 2));
        this._element.setAttribute("cy", String(y + size / 2));
        this._element.setAttribute("r", String(size / 2));
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this._element.setAttribute("x", String(x));
        this._element.setAttribute("y", String(y));
        this._element.setAttribute("width", String(size));
        this._element.setAttribute("height", String(size));
      }
    });
  }

  //if rotation === 0 - right side is rounded
  _basicSideRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size / 2}` + //draw line to left bottom corner + half of size right
            `a ${size / 2} ${size / 2}, 0, 0, 0, 0 ${-size}` // draw rounded corner
        );
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size}` + //draw line to right bottom corner
            `v ${-size / 2}` + //draw line to right bottom corner + half of size top
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded corner
        );
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size}` + //draw line to right bottom corner
            `a ${size} ${size}, 0, 0, 0, ${-size} ${-size}` // draw rounded top right corner
        );
      }
    });
  }

  //if rotation === 0 - left bottom and right top corners are rounded
  _basicCornersRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to left top position
            `v ${size / 2}` + //draw line to left top corner + half of size bottom
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${size / 2} ${size / 2}` + // draw rounded left bottom corner
            `h ${size / 2}` + //draw line to right bottom corner
            `v ${-size / 2}` + //draw line to right bottom corner + half of size top
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded right top corner
        );
      }
    });
  }
  _basicDuttonCarIcon(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const viewBoxSize = 505.63; // Assuming viewBox is double the size for better scaling

    // Create the path element (replace the path data as needed)
    const path = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M101.41,394.76
      c-5.26,15.5-1.44,15.98-22.85,15.84
      -7.9-.05-15.81.34-23.71.14
      -12.47-.3-16.99-4.08-18.69-16.76
      -1.73-12.91-3.45-25.92-3.66-38.91
      -.52-32.2-.22-64.41-.17-96.62
      .03-20.9,8.75-39.08,18.25-56.95
      3.1-5.84,8.05-9.08,15.01-8.63
      1.74.11,3.51-.17,6.16-.32
      -2.84-4.99-4.22-9.61-10.72-10.89
      -7.75-1.53-15.21-4.37-18.04-13.37
      -1.32-4.2-.3-7.03,3.17-9.05
      9.57-5.58,20.1-6.86,30.89-6.05
      4.73.36,6.7,3.92,6.42,8.44
      -.33,5.23-.98,10.44-.45,15.98
      5.01-9.72,9.66-19.64,15.11-29.1
      6.89-11.95,13.71-24.06,21.86-35.14
      10.39-14.11,24.8-21.38,42.83-21.33
      60.27.16,120.54.15,180.81-.02
      18.02-.05,32.93,6.93,42.74,21.39
      11.59,17.09,21.14,35.57,31.52,53.48
      2.02,3.48,3.73,7.14,6.69,10.35
      -.56-4.82-1.4-9.62-1.61-14.46
      -.3-7.04,2.47-10.41,9.4-9.81
      8.18.71,16.46,2.06,24.29,4.48
      8.48,2.62,10.7,8.18,3.18,16.84
      -3.09,3.56-8.58,5.4-13.32,7.09
      -7.12,2.53-7.56,2.46-11.44,10.86
      1.4.23,2.72.74,3.96.6
      9.97-1.1,14.99,4.82,19.25,12.69
      11.67,21.53,17.13,44.34,16.43,68.87
      -.96,33.57-1.19,67.16-2.11,100.72
      -.2,7.45-1.43,14.98-3.13,22.25
      -2.4,10.25-6.12,13.08-16.63,13.33
      -11.06.26-22.13.14-33.19-.12
      -8.98-.21-10.3-1.4-12.94-9.94
      -.7-2.25-1.16-4.57-1.78-7.04
      -4.9-.67-10.86.74-12.34-6.48
      -.13-.64-3.09-.99-4.74-.99
      -21.94,0-43.87.14-65.81.13
      -67.2-.03-134.39-.1-201.59-.2
      -3.5,0-6.14-.11-8.38,4.04
      -1.36,2.53-6.56,3-10.65,4.64
    Z

    M97,177.29
      h312.02
      c-.48-1.41-.68-2.58-1.24-3.54
      -11.11-19.1-22.03-38.32-33.5-57.2
      -5.01-8.25-13.26-11.26-22.83-11.25
      -65.2.06-130.4.11-195.61-.04
      -11.34-.02-19.89,4.26-25.64,13.96
      -9.46,15.96-18.87,31.95-28.21,47.98
      -1.76,3.02-3.12,6.27-5,10.09
    Z

    M123.81,255.99
      c-1.53-.81-3.05-1.69-4.63-2.42
      -20.74-9.6-41.49-19.18-62.25-28.75
      -9.46-4.36-11.59-3.36-14.63,6.95
      -.67,2.26-1.15,4.6-1.48,6.93
      -1.24,8.81,1.43,15.59,9.32,20.62
      11.6,7.39,23.62,13.33,37.36,15.54
      16.54,2.66,28.54-3.37,36.31-18.87
    Z

    M382.23,256.06
      c7.48,12.25,16.59,21.03,31.64,19.53
      16.89-1.69,32.05-8.14,45.26-18.72
      2.84-2.27,6-6.26,6.03-9.48
      .05-6.9-1.37-13.95-3.13-20.69
      -1.21-4.63-4.36-5.92-9.51-3.43
      -20.59,9.92-41.42,19.31-62.16,28.91
      -2.64,1.22-5.25,2.51-8.12,3.88
    Z`
    );
    path.setAttribute(
      "transform",
      `translate(${x},${y}) scale(${size / viewBoxSize},${size / viewBoxSize})`
    ); // Set the fill color to currentColor for flexibility
    this._element = path;
  }

  _drawDot({ x, y, size }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation: 0 });
  }

  _drawSquare({ x, y, size }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawRounded({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerRounded({ x, y, size, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, rotation });
      return;
    }
  }

  _drawExtraRounded({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerExtraRounded({ x, y, size, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, rotation });
      return;
    }
  }

  _drawClassy({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerRounded({ x, y, size, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawClassyRounded({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, rotation: 0 });
  }
  _drawDuttonCarIcon({ x, y, size }: DrawArgs): void {
    this._basicDuttonCarIcon({ x, y, size, rotation: 0 });
  }
}
