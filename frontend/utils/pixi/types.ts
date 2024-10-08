import { Sprite } from 'pixi.js'
import { RoomSchema, RealmDataSchema } from './zod'
import { z } from 'zod'

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'  | 'Eraser'

export type SpecialTile = 'None' | 'Impassable' | 'Teleport' | 'Spawn'

export type TileMode = 'Single' | 'Rectangle'

export type TilePoint = `${number}, ${number}`

export type RealmData = z.infer<typeof RealmDataSchema>

export type Room = z.infer<typeof RoomSchema>

export interface ColliderMap {
    [key: `${number}, ${number}`]: boolean
}

export interface GizmoSpriteMap {
    [key: `${number}, ${number}`]: Sprite
}

export interface TilemapSprites {
    [key: `${number}, ${number}`]: {
        floor?: Sprite,
        above_floor?: Sprite,
        object?: Sprite,
    }
}

export interface TileChange {
    layer: Layer,
    palette: string,
    tile: string,
}

export type Layer = 'floor' | 'above_floor' | 'object'

export type Bounds = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export type Point = {
    x: number,
    y: number,
}

export type Coordinate = [number, number]

export type AnimationState = 'idle_down' | 'idle_up' | 'idle_left' | 'idle_right' | 'walk_down' | 'walk_up' | 'walk_left' | 'walk_right'

export type Direction = 'down' | 'up' | 'left' | 'right'
