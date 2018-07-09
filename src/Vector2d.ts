/**
 * Vector2d
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2015-01-01
 */

import { cosLookupTable, sinLookupTable } from './main';

export class Vector2d {

    // FIXME: make these private
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(vector: Vector2d): void {
        this.x += vector.x;
        this.y += vector.y;
    }

    public sub(vector: Vector2d): void {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    public getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    public fromAngle(angle, magnitude): void {
        this.x = magnitude * cosLookupTable[angle];
        this.y = magnitude * sinLookupTable[angle];
    }

}
