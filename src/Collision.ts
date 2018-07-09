/**
 * 2D Collision Detection Library
 *
 * @author	Johannes Diemke
 * @version	1.0.0
 * @since	2014-12-15
 */

import { Vector2d } from './Vector2d';

export class Circle {

    private center: Vector2d;
    private radius: number;

    public constructor(position: Vector2d, radius: number) {
        this.center = position;
        this.radius = radius;
    }

    public intersects(circle: Circle): boolean {
        const dx = this.center.x - circle.center.x;
        const dy = this.center.y - circle.center.y;

        const dist = Math.sqrt((dx * dx) + (dy * dy));
        return dist <= (this.radius + circle.radius);
    }

}
