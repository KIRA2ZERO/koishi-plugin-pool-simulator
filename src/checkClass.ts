import { Context, Session ,h} from 'koishi'

export class CheckTools{

    // 属性
    ctx:Context
    session:Session

    // 构造函数
    constructor(ctx:Context,session:Session){
        this.ctx = ctx
        this.session = session
    }

    // checkPoolName
    checkPoolNameExist(row,poolName:string){
        if(typeof(row[0]) !== "undefined"){
            this.session.send(h('quote',{id:this.session.messageId}) + `【${poolName}】输入卡池名称已存在`)
            throw new Error('输入卡池名称已存在')
        }
    }

    checkPoolNameNotExist(row,poolName:string){
        if(typeof(row[0]) === "undefined"){
            this.session.send(h('quote',{id:this.session.messageId}) + `【${poolName}】输入卡池名称不存在`)
            throw new Error('输入卡池名称不存在')
        }
    }

    checkOwner(row){
        if (row[0].owner !== this.session.userId){
            this.session.send(h('quote',{id:this.session.messageId}) +`非卡池创始人不可设置`)
            throw new Error('非卡池创始人不可设置')
        }
    }

    checkBaodiRule(row,poolName:string,rule:string){
        const parts = rule.split('|');
        for (const part of parts) {
            const [rarity, value] = part.split(':');
            if (isNaN(Number(value))) {
                this.session.send(h('quote',{id:this.session.messageId})+`输入保底机制格式有误`)
                throw new Error('输入保底机制格式有误')
            }
            this.checkRarity(row,poolName,rarity)
        }
    }

    checkRarity(row,poolName:string,rarity:string){
        if(!(rarity in row[0].probability)){
            this.session.send(h('quote',{id:this.session.messageId}) +`【${poolName}】中不存在稀有度【${rarity}】`)
            throw new Error('稀有度不存在')
        }
    }

    checkGoodsExist(row,rarity:string,goods:string){
        let goodsList = row[0].goodsList;
        if(goodsList[rarity].indexOf(goods) === -1){
            this.session.send(h('quote',{id:this.session.messageId}) +`被替换的物品不存在`)
            throw new Error('被替换的物品不存在')  
        }
    }

    checkGoodsNotExist(row,rarity:string,goods:string){
        let goodsList = row[0].goodsList;
        if(goodsList[rarity].indexOf(goods) !== -1){
            this.session.send(h('quote',{id:this.session.messageId}) +`要替换的物品已存在`)
            throw new Error('要替换的物品已存在')
        }
    }

    checkProbability(row){
        if(JSON.stringify(row[0].probability) === "{}"){ 
            this.session.send(h('quote',{id:this.session.messageId})+`卡池概率未配置`)
            throw new Error('卡池概率未配置')
        }
    }

    checkGoodsList(row){
        if(JSON.stringify(row[0].goodsList) === "{}"){
            this.session.send(h('quote',{id:this.session.messageId})+`卡池物品未配置`)
            throw new Error('卡池物品未配置')
        }
    }

    checkGoodsListAll(row){
        for(let item in row[0].probability){
            if(row[0].goodsList[item] === undefined){
                this.session.send(h('quote',{id:this.session.messageId})+`卡池物品未配置完全`)
                throw new Error('卡池物品未配置完全')
            }
        }
    }

    checkDrawNumber(number:number){
        if (number > 100) {
            this.session.send(h('quote',{id:this.session.messageId})+`抽卡次数不能大于100`)
            throw new Error('抽卡次数不能大于100')
        }
        if (number <= 0) {
            this.session.send(h('quote',{id:this.session.messageId})+`抽卡次数不能小于等于0`)
            throw new Error('抽卡次数不能小于等于0')
        }
    }

}