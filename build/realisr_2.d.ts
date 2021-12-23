/* tslint:disable */
/* eslint-disable */
/**
*/
export class TimePlot {
  free(): void;
/**
* @param {number} x
* @param {number} y
*/
  add_point(x: number, y: number): void;
/**
*/
  calc_stats(): void;
/**
* @returns {number}
*/
  get_path_length(): number;
/**
* @returns {string}
*/
  my_to_string(): string;
/**
* @returns {TimePlot}
*/
  static new(): TimePlot;
}
/**
*/
export class WalkPoint {
  free(): void;
}
