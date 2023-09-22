# koishi-plugin-pool-simulator

[![npm](https://img.shields.io/npm/v/koishi-plugin-pool-simulator?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-pool-simulator)

可以自由定制池子并管理的抽卡模拟器

# 使用说明

##  正常使用流程

1.使用命令【创建卡池】创建一个新卡池 

    创建卡池 碧蓝航线重巡池

2.（可选步骤）使用命令【设置卡池描述】设置该卡池的描述信息

    设置卡池描述 碧蓝航线重巡池 复现碧蓝航线重巡池抽卡

3.使用命令【设置稀有度概率】设置该卡池的稀有度等级及其概率

    设置稀有度概率 碧蓝航线重巡池 超稀有:3.5% 精锐:15.5% 稀有:26% 普通:55%

4.使用命令【增加物品】给每个等级的稀有度配置物品池即可完成卡池初始化配置

    增加物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 高雄 爱宕 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良
    增加物品 碧蓝航线重巡池 精锐 休斯顿 印第安纳波利斯 阿斯托利亚 昆西 文森斯 威奇塔 伦敦 多塞特郡 约克 埃克塞特 足柄 羽黑 希佩尔海军上将 德意志 斯佩伯爵海军上将 铃谷 小欧根 小柴郡 小斯佩
    增加物品 碧蓝航线重巡池 稀有 北安普顿 芝加哥 波特兰 什罗普郡 肯特 萨福克 诺福克 妙高 那智 苏赛克斯 特伦托
    增加物品 碧蓝航线重巡池 普通 彭萨科拉 盐湖城 古鹰 加古 青叶 衣笠

5.（可选步骤）使用命令【设置保底机制】给指定卡池配置保底机制

    设置保底机制 碧蓝航线重巡池 普通:9|超稀有:1

6.（可选步骤）使用命令【展示卡池配置】展示指定卡牌的配置情况

    展示卡池配置 碧蓝航线重巡池

7.使用命令【抽卡】对指定配置完成的卡池进行抽卡

    抽卡 碧蓝航线重巡池 10

## 命令详解 

### poolmanager.create 

+  基本语法：`poolmanager.create <poolName:string>`
+  别名：`创建卡池`
+  用法：`在命令后面输入不存在的卡池名即可在pool_simulator_table表中创建一个卡池`
+  注意事项：`当要创建的卡池名称已存在将会创建失败`
+  示例：`创建卡池 碧蓝航线重巡池`

### poolmanager.delete 

+  基本语法：`poolmanager.delete <poolName:string>`
+  别名：`删除卡池`
+  用法：`在命令后面输入已存在的卡池名即可在pool_simulator_table表中删除该卡池`
+  注意事项：
    + `确保卡池名称是存在的`
    + `非卡池创始人无法配置`
+  示例：`删除卡池 碧蓝航线重巡池`

### poolmanager.setpooldescription

+  基本语法：`poolmanager.setpooldescription`
+  别名：`设置卡池描述`
+  用法：`按照示例输入命令即可给pool_simulator_table表中指定卡池设置描述信息`
+  注意事项： 
    + `确保卡池名称是存在的`
    + `非卡池创始人无法配置`
    + `描述信息中不要出现空格`
+  示例：`设置卡池描述 碧蓝航线重巡池 复现碧蓝航线重巡池抽卡`

### poolmanager.clear

+  基本语法：`poolmanager.clear`
+  别名：`清除卡池`
+  用法：`按照示例输入命令即可清除pool_simulator_table表中所有卡池`
+  注意事项：`只有命令发起人的authority=5才能使用`
+  示例：`清除卡池`

### poolmanager.configrarity

+  基本语法：`poolmanager.configrarity <poolName:string <rarity:text>`
+  别名：`设置稀有度概率`
+  用法：`按照示例输入命令即可设置pool_simulator_table表中指定池子的稀有度和概率`
+  注意事项：
    + `确保卡池名称是存在的`
    + `非卡池创始人无法配置`
    + `确保使用的是英文输入法下的":"`
    + `单个稀有度的最小概率为0.001%`
    + `只用于没有设置过稀有度概率的卡池`
    + `要修改某个卡池的稀有度概率，可以导出该卡池的配置修改后再导入`
+  `示例：设置稀有度概率 碧蓝航线重巡池 超稀有:3.5% 精锐:15.5% 稀有:26% 普通:55%`

### poolmanager.configbaodi

+  基本语法：`poolmanager.configbaodi <poolName:string> <rule:string>`
+  别名：`设置保底机制`
+  用法：`按照示例输入命令即可设置pool_simulator_table表中指定池子的保底机制`
+  注意事项：
    + `确保卡池名称是存在的`
    + `非卡池创始人无法配置`
    + `确保保底机制的格式与示例一致`
    + `保底机制配置逻辑为：在a次的抽卡中，如果有b次没有出现c稀有度的物品，则直接在d稀有度的物品池中抽取1次卡`
    + `配置完毕保底机制之后，需要在抽卡时使用-m选项才能使用带有保底的抽卡`
+  `示例：设置保底机制 碧蓝航线重巡池 普通:9|超稀有:1`

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

### poolmanager.removegoods 

+  基本语法：`poolmanager.removegoods <poolName:string <rarity:string <goods:text>`
+  别名：`删除物品`
+  用法：`按照示例输入命令即可删除pool_simulator_table表中指定池子的物品`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `非卡池创始人无法配置`
    +  `确保输入的稀有度是存在的`
+  示例：`删除物品 碧蓝航线重巡池 超稀有 巴尔的摩 筑摩 高雄 爱宕 摩耶 鸟海 布吕歇尔 欧根亲王 明尼阿波利斯 扎拉 布莱默顿 阿尔及利亚 罗恩 波拉 塔林 旧金山 新奥尔良`

### poolmanager.replacegoods 

+  基本语法：`poolmanager.replacegoods <poolName:string> <rarity1:string> <goods1:string> <rarity2:string> <goods2:string>`
+  别名：`替换物品`
+  用法：`按照示例输入命令即可替换pool_simulator_table表中指定池子的物品`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `非卡池创始人无法配置`
    +  `确保被替换的稀有度和要替换的稀有度是存在的`
    +  `确保被替换的物品是存在的，要替换的物品是不存在的`
+  示例：`替换物品 碧蓝航线重巡池 超稀有 巴尔的摩 普通 巴尔的摩`

### poolmanager.show

+  基本语法；`poolmanager.show`
+  别名：`展示所有卡池`
+  用法：`输入命令即可展示pool_simulator_table表中所有卡池名称`
+  注意事项：`无`
+  示例: `展示所有卡池`

### poolmanager.status

+  基本语法；`poolmanager.status <poolName:string>`
+  别名：`展示卡池配置`
+  用法：`按照示例输入命令即可展示pool_simulator_table表中指定卡池的配置`
+  注意事项：`确保卡池名称是存在的`
+  示例: `展示卡池配置 碧蓝航线重巡池`

### poolmanager.draw 

+  基本语法；`poolmanager.draw <poolName:string <number:posint>`
+  别名：`抽卡`
+  用法：`按照示例输入命令即可使用pool_simulator_table表中指定卡池的配置来抽卡`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `确保卡池已经完全配置`
    +  `确保抽卡次数小于等于100大于0`
    +  `使用 -m 可以启用保底机制，启用前需要配置保底机制`
+  示例: `抽卡 碧蓝航线重巡池 10`

### poolmanager.exportconfig

+  基本语法；`poolmanager.exportconfig <poolName:string>`
+  别名：`导出卡池配置`
+  用法：`按照示例输入命令即可导出pool_simulator_table表中指定卡池的配置`
+  注意事项：
    +  `确保卡池名称是存在的`
    +  `导出后每个字段的信息使用;;分割`
+  示例: `导出卡池配置 碧蓝航线重巡池`

### poolmanager.importconfig

+  基本语法；`poolmanager.importconfig <config:string>`
+  别名：`导入卡池配置`
+  用法：`按照示例输入命令即可导入配置到pool_simulator_table表中`
+  注意事项：
    +  `当要导入的卡池名称已存在将会导入失败`
    +  `导入后的卡池创始人将变更为使用导入命令的人`
+  示例: `导入卡池配置 碧蓝航线重巡池`


