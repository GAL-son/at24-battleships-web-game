import { ShipSetup } from "Logic/IGameSetup"
import { defaultShipSetup } from "./DefaultShipSetup";
import { ShipPlacement } from "Global/Logic/Game/Types";

const botShipSetups = new Map<ShipSetup, ShipPlacement[][]>();

botShipSetups.set(
    defaultShipSetup, 
    [
        [
            {shipSize: 1, vertically: true, position: {x: 0, y: 0}},
            {shipSize: 1, vertically: true, position: {x: 9, y: 0}},
            {shipSize: 1, vertically: true, position: {x: 0, y: 9}},
            {shipSize: 1, vertically: true, position: {x: 9, y: 9}},
            {shipSize: 2, vertically: true, position: {x: 2, y: 0}},
            {shipSize: 2, vertically: false, position: {x: 8, y: 2}},
            {shipSize: 2, vertically: true, position: {x: 7, y: 8}},
            {shipSize: 3, vertically: false, position: {x: 0, y: 7}},
            {shipSize: 3, vertically: true, position: {x: 4, y: 0}},
            {shipSize: 4, vertically: false, position: {x: 6, y: 4}},
        ],
    ]
);

botShipSetups.set(
    {'2': 1},
    [
        [
            { shipSize: 2, vertically: false, position: { x: 2, y: 7 }}
        ]
    ]
)

export {botShipSetups}