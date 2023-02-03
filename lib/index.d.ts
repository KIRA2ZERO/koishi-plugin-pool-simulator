import { Context, Schema } from 'koishi';
export declare const name = "pool-simulator";
export interface Config {
}
export declare const Config: Schema<Config>;
declare module 'koishi' {
    interface Tables {
        pool_simulator_table: pool_simulator_table;
    }
}
export interface pool_simulator_table {
    id: number;
    poolName: string;
    goodsList: any;
    probability: any;
    owner: string;
}
export declare function apply(ctx: Context): void;
