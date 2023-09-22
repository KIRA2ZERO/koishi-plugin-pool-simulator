import { Context, Schema } from 'koishi'

import { PoolManager } from './class'

export const name = 'pool-simulator'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

declare module 'koishi' {
  interface Tables {
    pool_simulator_table: pool_simulator_table
  }
}

export interface pool_simulator_table {
  id: number
  poolName: string
  description: string
  goodsList: any
  probability:any
  rule:string
  owner:string
}

export function apply(ctx: Context) {

  ctx.model.extend('pool_simulator_table', {
    id: 'unsigned',
    poolName: 'string',
    description: 'string',
    goodsList: 'json',
    probability:'json',
    rule:'string',
    owner:'string'
  }, {
    autoInc: true,
  })
  
  ctx.command('poolmanager','抽卡模拟器（直接调用该命令无任何作用需要使用子命令）').alias('抽卡模拟器')
  .usage(`使用教程 https://github.com/KIRA2ZERO/koishi-plugin-pool-simulator`)

  ctx.command('poolmanager.create <poolName:string>','创建卡池').alias('创建卡池')
  .example(`创建卡池 碧蓝航线重巡池`)
  .action(async ({session},poolName) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.create(poolName)
  })

  ctx.command('poolmanager.delete <poolName:string>','删除卡池').alias('删除卡池')
  .example(`删除卡池 碧蓝航线重巡池`)
  .action(async ({session},poolName) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.remove(poolName)
  })

  ctx.command('poolmanager.setpooldescription <poolName:string> <description:string>').alias(`设置卡池描述`)
  .example(`设置卡池描述 碧蓝航线重巡池 复现碧蓝航线重巡池抽卡`)
  .action(async ({session},poolName,description) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.setPoolDescription(poolName,description)
  })

  ctx.command('poolmanager.clear','清除卡池',{authority:5}).alias('清除卡池')
  .example(`清除卡池`)
  .action(async({session}) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.clear()
  })

  ctx.command('poolmanager.configrarity <poolName:string> <rarity:text>','设置稀有度概率').alias('设置稀有度概率')
  .example(`设置稀有度概率 碧蓝航线重巡池 超稀有:3.5% 精锐:15.5% 稀有:26% 普通:55%`)
  .action(async({session},poolName,rarity) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.configRarity(poolName,rarity)
  })

  ctx.command('poolmanager.configbaodi <poolName:string> <rule:string>','设置保底机制').alias('设置保底机制')
  .example(`设置保底机制 碧蓝航线重巡池 普通:9|超稀有:1`)
  .action(async({session},poolName,rule) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.configBaodi(poolName,rule)
  })

  ctx.command('poolmanager.addgoods <poolName:string> <rarity:string> <goods:text>','增加物品').alias('增加物品')
  .example(`增加物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 高雄 爱宕 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良`)
  .action(async({session},poolName,rarity,goods) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.addGoods(poolName,rarity,goods)
  })

  ctx.command('poolmanager.removegoods <poolName:string> <rarity:string> <goods:text>','删除物品').alias('删除物品')
  .example(`删除物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良`)
  .action(async({session},poolName,rarity,goods) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.removeGoods(poolName,rarity,goods)
  })

  ctx.command('poolmanager.replacegoods <poolName:string> <rarity1:string> <goods1:string> <rarity2:string> <goods2:string>','替换物品').alias('替换物品')
  .example(`替换物品 碧蓝航线重巡池 超稀有 巴尔的摩 普通 巴尔的摩`)
  .action(async({session},poolName,rarity1,goods1,rarity2,goods2) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.replaceGoods(poolName,rarity1,goods1,rarity2,goods2)
  })

  ctx.command('poolmanager.show','展示所有卡池').alias('展示所有卡池')
  .example('展示所有卡池')
  .action(async ({session}) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.show()
  })

  ctx.command('poolmanager.status <poolName:string>','展示卡池配置').alias('展示卡池配置')
  .example(`展示卡池配置 碧蓝航线重巡池`)
  .action(async({session},poolName) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.status(poolName)
  })

  ctx.command('poolmanager.draw <poolName:string> <number:posint>','抽卡').alias('抽卡')
  .option('mode','-m 默认为非保底，启用为保底',{fallback:false})
  .example(`抽卡 碧蓝航线重巡池 10`)
  .action(async({session,options},poolName,number) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.draw(poolName,number,options.mode)
  })

  ctx.command('poolmanager.exportconfig <poolName:string>','导出卡池配置').alias('导出卡池配置')
  .example(`导出卡池配置 碧蓝航线重巡池`)
  .action(async({session},poolName) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.exportConfig(poolName)
  })

  ctx.command('poolmanager.importconfig <config:string>','导入卡池配置').alias('导入卡池配置')
  .example(`导入卡池配置 碧蓝航线重巡池`)
  .action(async({session},config) => {
    const poolManager = new PoolManager(ctx,session)
    poolManager.importConfig(config)
  })

}

