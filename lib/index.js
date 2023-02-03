"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'pool-simulator';
exports.Config = koishi_1.Schema.object({});
function apply(ctx) {
    // 创建pool_simulator_table表
    ctx.model.extend('pool_simulator_table', {
        id: 'unsigned',
        poolName: 'string',
        goodsList: 'json',
        probability: 'json',
        owner: 'string'
    }, {
        // 使用自增的主键值
        autoInc: true,
    });
    ctx.command('poolmanager', '抽卡模拟器（直接调用该命令无任何作用需要使用子命令）').alias('抽卡模拟器')
        .usage(`用法:1.先创建卡池再设置稀有度概率再给每个稀有度添加物品才能开始抽卡
  2.每个子命令都有对应中文别名可以快捷调用
  3.对某个子命令用法不理解请输入"子命令 -h"
  4.只有卡池创始人才有权利删除对应卡池,以及设置稀有度概率和增删物品`);
    ctx.command('poolmanager.create <poolName:string>', '创建卡池').alias('创建卡池')
        .example(`创建卡池 碧蓝航线重巡池`)
        .action(async ({ session }, poolName) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) !== "undefined") {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `【${poolName}】池子名已存在,创建失败`);
            }
            else {
                ctx.database.create('pool_simulator_table', { poolName: poolName, owner: session.userId });
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `【${poolName}】已创建`);
            }
        });
    });
    ctx.command('poolmanager.delete <poolName:string>', '删除卡池').alias('删除卡池')
        .example(`删除卡池 碧蓝航线重巡池`)
        .action(async ({ session }, poolName) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) !== "undefined") {
                return row[0];
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `输入卡池名称不存在`);
            }
        })
            .then(result => {
            if (result.owner !== session.userId) {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `非卡池创始人无权删除`);
            }
            else {
                ctx.database.remove('pool_simulator_table', { poolName: [poolName] });
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `【${poolName}】已删除`);
            }
        });
    });
    ctx.command('poolmanager.clear', '清除卡池', { authority: 5 }).alias('清除卡池')
        .usage(`需要authority=5才能使用`)
        .action(async ({ session }) => {
        await ctx.database.remove('pool_simulator_table', {});
        session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `所有卡池已被删除`);
    });
    ctx.command('poolmanager.rarity <poolName:string> <rarity:text>', '设置稀有度概率').alias('设置稀有度概率')
        .example(`设置稀有度概率 碧蓝航线重巡池 超稀有:7% 精锐:12% 稀有:26% 普通:55%`)
        .usage(`注意事项:1.%可写可不写\n2.确保使用的是英文输入法下的:\n3.确保概率之和为100%\n4.单位精度为1%\n5.如果已完成卡池配置再重新设置稀有度概率，请确保稀有度名称不变，否则请删除卡池重新创建`)
        .action(async ({ session }, poolName, rarity) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) !== "undefined") {
                return row[0];
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `输入卡池名称不存在`);
            }
        })
            .then(result => {
            if (result.owner === session.userId) {
                return result;
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `非卡池创始人不可设置`);
            }
        })
            .then(result => {
            let probability = {}, goodsList = result.goodsList, raritySplit = rarity.split(' '), all_probability = 100;
            for (let item of raritySplit) {
                let rare = item.split(':')[0], odds = parseInt(item.split(':')[1]);
                probability[rare] = odds;
                all_probability -= odds;
            }
            if (JSON.stringify(goodsList) !== "{}") {
                for (let item in probability) {
                    if (!(item in goodsList)) {
                        session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `【${item}】不存在于goodsList字段,设置失败`);
                        return;
                    }
                }
            }
            if (all_probability !== 0) {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `总概率不为100%,设置失败`);
                return;
            }
            ctx.database.set('pool_simulator_table', { poolName: [poolName] }, { probability: probability });
            session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `成功为【${poolName}】设置稀有度和概率`);
        });
    });
    ctx.command('poolmanager.addgoods <poolName:string> <rarity:string> <goods:text>', '增加物品').alias('增加物品')
        .example(`增加物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 高雄 爱宕 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良\n
增加物品 碧蓝航线重巡池 精锐 休斯顿 印第安纳波利斯 阿斯托利亚 昆西 文森斯 威奇塔 伦敦 多塞特郡 约克 埃克塞特 足柄 羽黑 希佩尔海军上将 德意志 斯佩伯爵海军上将 铃谷 小欧根 小柴郡 小斯佩\n
增加物品 碧蓝航线重巡池 稀有 北安普顿 芝加哥 波特兰 什罗普郡 肯特 萨福克 诺福克 妙高 那智 苏赛克斯 特伦托\n
增加物品 碧蓝航线重巡池 普通 彭萨科拉 盐湖城 古鹰 加古 青叶 衣笠`)
        .usage(`注意事项:即使重复输入,每个稀有度里的物品也是唯一`)
        .action(async ({ session }, poolName, rarity, goods) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) !== "undefined") {
                return row[0];
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `输入卡池名称不存在`);
            }
        })
            .then(result => {
            if (rarity in result.probability) {
                return result;
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `【${poolName}】中不存在稀有度【${rarity}】`);
            }
        })
            .then(result => {
            if (result.owner === session.userId) {
                return result;
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `非卡池创始人不可更改`);
            }
        })
            .then(result => {
            let goodsList = result.goodsList, odds = goods.split(' ');
            if (typeof (goodsList[rarity]) === 'undefined') {
                goodsList[rarity] = [];
            }
            for (let item of odds) {
                if (goodsList[rarity].indexOf(item) === -1) {
                    goodsList[rarity].push(item);
                }
            }
            ctx.database.set('pool_simulator_table', { poolName: [poolName] }, { goodsList: goodsList });
            session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `成功为【${poolName}】添加物品`);
        });
    });
    ctx.command('poolmanager.removegoods <poolName:string> <rarity:string> <goods:text>', '删除物品').alias('删除物品')
        .example(`删除物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良`)
        .action(async ({ session }, poolName, rarity, goods) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) !== "undefined") {
                return row[0];
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `输入卡池名称不存在`);
            }
        })
            .then(result => {
            if (rarity in result.probability) {
                return result;
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `【${poolName}】中不存在稀有度【${rarity}】`);
            }
        })
            .then(result => {
            if (result.owner === session.userId) {
                return result;
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `非卡池创始人不可更改`);
            }
        })
            .then(result => {
            let goodsList = result.goodsList, odds = goods.split(' ');
            for (let item of odds) {
                if (goodsList[rarity].indexOf(item) !== -1) {
                    goodsList[rarity] = goodsList[rarity].filter(i => i !== item);
                }
            }
            ctx.database.set('pool_simulator_table', { poolName: [poolName] }, { goodsList: goodsList });
            session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `成功为【${poolName}】删除物品`);
        });
    });
    ctx.command('poolmanager.show', '展示所有卡池').alias('展示所有卡池')
        .action(async ({ session }) => {
        let row = await ctx.database.get('pool_simulator_table', {}, ['poolName']), messageList = [(0, koishi_1.h)('message', `所有卡池：`)], i = 1;
        for (let item of row) {
            messageList.push((0, koishi_1.h)('message', `${i}.${item.poolName}`));
            i++;
        }
        session.send((0, koishi_1.h)('message', { forward: true }, messageList));
    });
    ctx.command('poolmanager.state <poolName:string>', '展示卡池配置').alias('展示卡池配置')
        .example(`展示卡池配置 碧蓝航线重巡池`)
        .action(async ({ session }, poolName) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) === "undefined") {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `输入卡池名称不存在`);
            }
            else {
                let messageList = [(0, koishi_1.h)('message', `【${poolName}】卡池配置如下：`)], probability = row[0].probability, goodsList = row[0].goodsList;
                for (let item in probability) {
                    messageList.push((0, koishi_1.h)('message', `${item}(${probability[item]}%):${goodsList[item]}`));
                }
                session.send((0, koishi_1.h)('message', { forward: true }, messageList));
            }
        });
    });
    ctx.command('poolmanager.draw <poolName:string> <number:posint>', '抽卡').alias('抽卡')
        .shortcut(/^单抽 (.+)$/, { args: ['$1', '1'] })
        .shortcut(/^十连抽 (.+)$/, { args: ['$1', '10'] })
        .shortcut(/^一百连抽 (.+)$/, { args: ['$1', '100'] })
        .example(`抽卡 碧蓝航线重巡池 10\n单抽 碧蓝航线重巡池\n十连抽 碧蓝航线重巡池\n一百连抽 碧蓝航线重巡池`)
        .action(async ({ session }, poolName, number) => {
        await ctx.database.get('pool_simulator_table', { poolName: [poolName] })
            .then(row => {
            if (typeof (row[0]) !== "undefined") {
                return row[0];
            }
            else {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `输入卡池名称不存在`);
            }
        })
            .then(result => {
            let goodsList = result.goodsList, messageList = [], summary = new Map(), probability = result.probability;
            if (JSON.stringify(probability) === "{}") {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `卡池概率未配置,抽卡失败`);
                return;
            }
            if (JSON.stringify(goodsList) === "{}") {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `卡池物品未配置,抽卡失败`);
                return;
            }
            for (let item in probability) {
                if (goodsList[item] === undefined) {
                    session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `卡池物品未配置完全,抽卡失败`);
                    return;
                }
            }
            if (number > 100) {
                session.send((0, koishi_1.h)('quote', { id: session.messageId }) + `抽卡次数不能大于100`);
                return;
            }
            for (let i = 1; i <= number; i++) {
                let outcome = Draw(goodsList, probability), message = (0, koishi_1.h)('message', `第${i}次抽卡结果:【${outcome[0]} ${outcome[1]}】`);
                messageList.push(message);
                summary.get(outcome[0]) === undefined ? summary.set(outcome[0], 1) : summary.set(outcome[0], summary.get(outcome[0]) + 1);
            }
            let message = '';
            for (let item of summary) {
                message += `${item[0]}:${item[1]}个 `;
            }
            messageList.push(message);
            session.send((0, koishi_1.h)('message', { forward: true }, messageList));
        });
    });
}
exports.apply = apply;
function Draw(goodsList, probability) {
    let poolFirst = [], outcome;
    for (let item in probability) {
        for (let i = 1; i <= probability[item]; i++) {
            poolFirst.push(item);
        }
    }
    let random = Math.floor(Math.random() * poolFirst.length), rarity = poolFirst[random], poolSecond = goodsList[rarity];
    random = Math.floor(Math.random() * poolSecond.length);
    outcome = [rarity, poolSecond[random]];
    return outcome;
}