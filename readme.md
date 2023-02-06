# koishi-plugin-pool-simulator

[![npm](https://img.shields.io/npm/v/koishi-plugin-pool-simulator?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-pool-simulator)

可以自由定制池子并管理的抽卡模拟器

# 使用说明

##  使用流程

1.使用命令【创建卡池】创建一个新卡池 

    例如：
    创建卡池 碧蓝航线重巡池

2.使用命令【设置稀有度概率】设置该卡池的稀有度等级及其概率

    例如：
    设置稀有度概率 碧蓝航线重巡池 超稀有:7% 精锐:12% 稀有:26% 普通:55%

3.使用命令【增加物品】给每个等级的稀有度配置物品池即可完成卡池初始化配置

    例如：
    增加物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 高雄 爱宕 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良
    增加物品 碧蓝航线重巡池 精锐 休斯顿 印第安纳波利斯 阿斯托利亚 昆西 文森斯 威奇塔 伦敦 多塞特郡 约克 埃克塞特 足柄 羽黑 希佩尔海军上将 德意志 斯佩伯爵海军上将 铃谷 小欧根 小柴郡 小斯佩
    增加物品 碧蓝航线重巡池 稀有 北安普顿 芝加哥 波特兰 什罗普郡 肯特 萨福克 诺福克 妙高 那智 苏赛克斯 特伦托
    增加物品 碧蓝航线重巡池 普通 彭萨科拉 盐湖城 古鹰 加古 青叶 衣笠

4.使用命令【抽卡】对指定配置完成的卡池进行抽卡

    例如：
    抽卡 碧蓝航线重巡池 10

## 命令详解 

### poolmanager.create 

+  基本语法：`poolmanager.create <poolName:string>`
+  别名：`创建卡池`
+  用法：`在命令后面输入字符串即可在pool_simulator_table表中初始化一个数据行`
+  注意事项：`当要创建的卡池名称已存在将会创建失败`
+  示例：`创建卡池 碧蓝航线重巡池`

### poolmanager.delete 

+  基本语法：`poolmanager.delete <poolName:string>`
+  别名：`删除卡池`
+  用法：`在命令后面输入字符串即可在pool_simulator_table表中删除指定数据行`
+  注意事项：`当输入卡池名称不存在时会删除失败且非卡池创始人无权删除`
+  示例：`删除卡池 碧蓝航线重巡池`

### poolmanager.clear

+  基本语法：`poolmanager.clear`
+  别名：`清除卡池`
+  用法：`输入命令即可清除pool_simulator_table表中所有卡池`
+  注意事项：`只有命令发起人的authority=5才能使用`
+  示例：`清除卡池`

### poolmanager.rarity 

+  基本语法：`poolmanager.rarity <poolName:string <rarity:text>`
+  别名：`设置稀有度概率`
+  用法：`按照示例输入命令即可设置pool_simulator_table表中指定池子的稀有度和概率`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `确保使用的是英文输入法下的":"`
    +  `非卡池创始人无法配置`
    + `单个稀有度的最小概率为1%`
    + `如果已完成卡池配置再重新设置稀有度概率，请确保稀有度名称不变，否则请删除卡池重新创建`
+  `示例：设置稀有度概率 碧蓝航线重巡池 超稀有:7% 精锐:12% 稀有:26% 普通:55%`

### poolmanager.addgoods 

+  基本语法：`poolmanager.addgoods <poolName:string <rarity:string <goods:text>`
+  别名：`增加物品`
+  用法：`按照示例输入命令即可增加pool_simulator_table表中指定池子的物品`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `非卡池创始人无法配置`
    +  `确保输入的稀有度是存在的`
    +  `即使重复输入每个稀有度里的物品也是唯一的`
+  示例：`增加物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 高雄 爱宕 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良`

### poolmanager.show

+  基本语法；`poolmanager.show`
+  别名：`展示所有卡池`
+  用法：`输入命令即可展示pool_simulator_table表中所有卡池名称`
+  注意事项：`无`
+  示例: `展示所有卡池`

### poolmanager.state 

+  基本语法；`poolmanager.state <poolName:string>`
+  别名：`展示所有卡池`
+  用法：`按照示例输入命令即可展示pool_simulator_table表中指定卡池的物品和概率`
+  注意事项：`确保卡池名称是存在的`
+  示例: `展示卡池配置 碧蓝航线重巡池`

### poolmanager.draw 

+  基本语法；`poolmanager.draw <poolName:string <number:posint>`
+  别名：`抽卡`
+  用法：`按照示例输入命令即可使用pool_simulator_table表中指定卡池的配置来抽卡`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `确保抽卡次数小于等于100大于0`
    +  `确保卡池已经完全配置`
+  示例: `抽卡 碧蓝航线重巡池 10（快捷调用方式：单抽 or 十连抽 or 一百连抽 碧蓝航线重巡池 ）`






