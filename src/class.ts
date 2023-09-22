import { Context, Session ,h} from 'koishi'

import { CheckTools } from './checkClass'

export class PoolManager{

    // 属性
    ctx:Context
    session:Session

    // 构造函数
    constructor(ctx:Context,session:Session){
        this.ctx = ctx
        this.session = session
    }

    // 创建卡池
    async create(poolName:string):Promise<void>{
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameExist(row,poolName)

        ctx.database.create('pool_simulator_table',{poolName:poolName,owner:session.userId})
        session.send(h('quote',{id:session.messageId}) +`【${poolName}】已创建`)
    }

    // 设置卡池描述
    async setPoolDescription(poolName:string,description:string){
      const ctx = this.ctx;
      const session = this.session;
      const checkTools = new CheckTools(ctx,session);

      const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})

      checkTools.checkPoolNameNotExist(row,poolName)
      checkTools.checkOwner(row)

      ctx.database.set('pool_simulator_table',{poolName:[poolName]},{description:description})
      session.send(h('quote',{id:session.messageId}) +`【${poolName}】已设置卡池描述信息`)
    }

    // 删除卡池
    async remove(poolName:string):Promise<void>{
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})

        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkOwner(row)

        ctx.database.remove('pool_simulator_table', {poolName:[poolName]})
        session.send(h('quote',{id:session.messageId}) +`【${poolName}】已删除`)
    }

    // 清除所有卡池
    async clear():Promise<void>{
        const ctx = this.ctx;
        const session = this.session;

        await ctx.database.remove('pool_simulator_table', {})
        session.send(h('quote',{id:session.messageId}) +`所有卡池已被删除`)
    }

    // 设置卡池概率
    async configRarity(poolName:string,rarity:string){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkOwner(row)

        const result = row[0],
              raritySplit = rarity.split(' '),
              probability = {};
        let all_probability = 100*1000;

        // 是否为初始化设置
        if(JSON.stringify(result.probability) === "{}" && JSON.stringify(result.goodsList) === "{}"){
            for(let item of raritySplit){
              let rare = item.split(':')[0],
                  odds = parseFloat(item.split(':')[1]);
              probability[rare] = odds;
              all_probability -=  odds*1000
            }
        }
        // check all_probability
        if(all_probability !== 0){
            session.send(h('quote',{id:session.messageId})+`总概率不为100%,设置失败`)
            return
        }

        ctx.database.set('pool_simulator_table',{poolName:[poolName]},{probability:probability})
        session.send(h('quote',{id:session.messageId})+`成功为【${poolName}】设置稀有度和概率`)
    }

    // 配置保底机制
    async configBaodi(poolName:string,rule:string){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkOwner(row)
        checkTools.checkBaodiRule(row,poolName,rule)

        ctx.database.set('pool_simulator_table',{poolName:[poolName]},{rule:rule})
        session.send(h('quote',{id:session.messageId})+`成功为【${poolName}】设置保底机制`)
    }

    // 增加物品
    async addGoods(poolName:string,rarity:string,goods:string,print:boolean=true){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkOwner(row)
        checkTools.checkRarity(row,poolName,rarity)

        const result = row[0];
        let goodsList = result.goodsList,
            odds = goods.split(' ');
        if(typeof(goodsList[rarity]) === 'undefined'){ 
          goodsList[rarity] = [] 
        }
        for(let item of odds){
          if(goodsList[rarity].indexOf(item) === -1){
            goodsList[rarity].push(item)
          }
        }

        ctx.database.set('pool_simulator_table',{poolName:[poolName]},{goodsList:goodsList})
        if(print) session.send(h('quote',{id:session.messageId})+`成功为【${poolName}】添加物品`)
    }

    // 删除物品
    async removeGoods(poolName:string,rarity:string,goods:string,print:boolean=true){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkOwner(row)
        checkTools.checkRarity(row,poolName,rarity)

        const result = row[0];
        let goodsList = result.goodsList,
            odds = goods.split(' ');
        for(let item of odds){
          if(goodsList[rarity].indexOf(item) !== -1){
            goodsList[rarity] = goodsList[rarity].filter(i => i !== item)
          }
        }
        ctx.database.set('pool_simulator_table',{poolName:[poolName]},{goodsList:goodsList})
        if(print) session.send(h('quote',{id:session.messageId})+`成功为【${poolName}】删除物品`)
    }

    // 替换物品
    async replaceGoods(poolName:string,rarity1:string,goods1:string,rarity2:string,goods2:string){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkOwner(row)
        checkTools.checkRarity(row,poolName,rarity1)
        checkTools.checkRarity(row,poolName,rarity2)
        checkTools.checkGoodsExist(row,rarity1,goods1)
        checkTools.checkGoodsNotExist(row,rarity2,goods2)

        let goodsList = row[0].goodsList;
        goodsList[rarity1] = goodsList[rarity1].filter(i => i !== goods1)
        goodsList[rarity2].push(goods2)
        
        ctx.database.set('pool_simulator_table',{poolName:[poolName]},{goodsList:goodsList})
        session.send(h('quote',{id:session.messageId})+`成功为【${poolName}】替换物品`)
    }

    // 展示所有卡池
    async show(){
        const ctx = this.ctx;
        const session = this.session;

        let row = await ctx.database.get('pool_simulator_table',{},['poolName']),
            messageList = [h('message',`所有卡池：`)],
            i = 1;
        for(let item of row){
            messageList.push(h('message',`${i}.${item.poolName}`))
            i ++
        }
        session.send(h('message', {forward:true}, messageList))
    }

    // 展示卡池配置
    async status(poolName:string){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)

        let messageList = [h('message',`【${poolName}】卡池配置如下：`),
                           h('message',`卡池描述:${row[0].description}`),
                           h('message',`保底机制:${row[0].rule}`)],
            probability = row[0].probability,
            goodsList = row[0].goodsList;
        for( let item in probability ){ 
          messageList.push( h( 'message',`${item}(${probability[item]}%):${goodsList[item]}` ) ) 
        }
        session.send(h('message',{forward:true},messageList))
    }

    // 抽卡
    async draw(poolName:string,number:number,isOpenBaodi:boolean){
        const ctx = this.ctx;
        const session = this.session;
        const checkTools = new CheckTools(ctx,session);

        const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
        checkTools.checkPoolNameNotExist(row,poolName)
        checkTools.checkProbability(row)
        checkTools.checkGoodsList(row)
        checkTools.checkGoodsListAll(row)
        checkTools.checkDrawNumber(number)
        
        const goodsList = row[0].goodsList,
              probability = row[0].probability,
              rule = row[0].rule;
        //  有保底机制的抽卡
        const {outcomeList, summary} = this.drawWithGuarantee(goodsList,probability,rule,isOpenBaodi,number)
        //   基于抽卡结果构建消息列表
        const messageList = this.createMessageList(outcomeList,summary,number)
        session.send(h('message', {forward:true}, messageList))    

    }

    // 导出卡池配置
    async exportConfig(poolName:string){
      const ctx = this.ctx;
      const session = this.session;
      const checkTools = new CheckTools(ctx,session);

      const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
      checkTools.checkPoolNameNotExist(row,poolName)

      const result = row[0]
      const config = `${result.poolName};;${result.description};;${JSON.stringify(result.goodsList)};;${JSON.stringify(result.probability)};;${result.rule};;${result.owner}`
      session.send(h('quote',{id:session.messageId}) + config)
    }

    // 导入卡池配置
    async importConfig(config:string){
      const ctx = this.ctx;
      const session = this.session;
      const checkTools = new CheckTools(ctx,session);

      const poolName = config.split(";;")[0],
            description = config.split(";;")[1],
            goodsList = JSON.parse(config.split(";;")[2]),
            probability = JSON.parse(config.split(";;")[3]),
            rule = config.split(";;")[4];

      const row = await ctx.database.get('pool_simulator_table',{poolName:[poolName]})
      checkTools.checkPoolNameExist(row,poolName)

      ctx.database.create('pool_simulator_table',{poolName:poolName,owner:session.userId})
      ctx.database.set('pool_simulator_table',{poolName:poolName},{description:description,goodsList:goodsList,probability:probability,rule:rule},)
      session.send(h('quote',{id:session.messageId})+`成功导入【${poolName}】卡池配置`)
    }

    drawWithGuarantee(goodsList, probability, rule:string, isOpenBaodi:boolean ,number:number) {
      // 解析保底规则
      const ruleFirst = rule.split("|")[0],
            ruleSecond =  rule.split("|")[1];

      let count = 0;
      let outcomeList = [];
      let summary = new Map();
  
      for(let i=1; i <= number; i++){
          let outcome = Draw(goodsList,probability);
          if (isOpenBaodi && outcome[0] === ruleFirst.split(":")[0]){
              count++;
              // 触发保底抽卡
              if (count === parseInt(ruleFirst.split(":")[1])){
                  count = 0;
                  outcome = appointDraw(goodsList,ruleSecond.split(":")[0]);
              }
          }
          outcomeList.push(outcome);
          (summary.get(outcome[0]) === undefined) ? summary.set(outcome[0],1):summary.set(outcome[0],summary.get(outcome[0])+1);
      }
  
      return {outcomeList: outcomeList, summary: summary};
    }

    createMessageList(outcomeList,summary,number:number){
        const messageList = []
        // 基于抽卡结果创建消息列表
        for(let i=0;i<number;i++){
            const message = h('message',`第${i+1}次抽卡结果:【${outcomeList[i][0]} ${outcomeList[i][1]}】`);
            messageList.push(message);
          }
          let message = ''
          for(let item of summary){
            message +=`${item[0]}:${item[1]}个 `;
          }
          messageList.push(message)
          return messageList
    }

}

function Draw(goodsList:any,probability:any){
  let poolFirst = [],
      outcome:any;
  for(let item in probability){
    for(let i = 1; i <= probability[item]*1000 ;i++){
      poolFirst.push(item)
    }
  }
  let random = Math.floor(Math.random()*poolFirst.length),
      rarity = poolFirst[random],
      poolSecond = goodsList[rarity];
  random = Math.floor(Math.random()*poolSecond.length)
  outcome = [rarity,poolSecond[random]]
  return outcome
}

function appointDraw(goodsList:any,rarity:string){
    const poolSecond = goodsList[rarity],
          random = Math.floor(Math.random()*poolSecond.length),
          outcome = [rarity,poolSecond[random]];
    return outcome
}
