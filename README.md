# 2048

## 教育版改造：《知识阶梯 2048》

本改造在原版基础上做了一个**教育化改动**。需要说明的是：**游戏规则、棋盘算法、胜负判定完全沿用原版，一行未删改。**

改造的内容是把 2→4→8→…→2048 这 11 个等级，映射成教师专业能力的 11 级进阶：

| 等级 | 阶段 | 出处 |
| --- | --- | --- |
| 2 / 4 / 8 / 16 / 32 / 64 | 识记 → 理解 → 应用 → 分析 → 评价 → 创造 | 布卢姆认知目标分类学 |
| 128 / 256 / 512 / 1024 / 2048 | 需求 → 设计 → 开发 → 实施 → 评估 | ADDIE 教学系统设计 |

于是玩的过程不再只是凑数字：每合并一次，棋盘下方会弹出一张**知识点卡片**，讲清这一级对应的教学理论含义，以及再上一级会走到哪里。走到「评估」意味着走完了整个教学系统设计闭环。

**改动清单：**

| 文件 | 性质 | 说明 |
| --- | --- | --- |
| `js/knowledge.js` | 新增 | 11 级知识点数据与查询函数 |
| `style/edu.css` | 新增 | 方块排版与知识点卡片样式（**未改动原版 main.css**） |
| `js/html_actuator.js` | 修改 | 方块显示阶段名；新增卡片渲染逻辑 |
| `js/game_manager.js` | 修改 | 记录并传递每次合并出的最高等级 |
| `index.html` | 修改 | 引入新文件与卡片容器；中文文案 |

---

（以下为原版说明）

A small clone of [1024](https://play.google.com/store/apps/details?id=com.veewo.a1024), based on [Saming's 2048](http://saming.fr/p/2048/) (also a clone). 2048 was indirectly inspired by [Threes](https://asherv.com/threes/).

Made just for fun. [Play it here!](http://gabrielecirulli.github.io/2048/)

The official app can also be found on the [Play Store](https://play.google.com/store/apps/details?id=com.gabrielecirulli.app2048) and [App Store!](https://itunes.apple.com/us/app/2048-by-gabriele-cirulli/id868076805)

### Contributions

[Anna Harren](https://github.com/iirelu/) and [sigod](https://github.com/sigod) are maintainers for this repository.

Other notable contributors:

 - [TimPetricola](https://github.com/TimPetricola) added best score storage
 - [chrisprice](https://github.com/chrisprice) added custom code for swipe handling on mobile
 - [marcingajda](https://github.com/marcingajda) made swipes work on Windows Phone
 - [mgarciaisaia](https://github.com/mgarciaisaia) added support for Android 2.3

Many thanks to [rayhaanj](https://github.com/rayhaanj), [Mechazawa](https://github.com/Mechazawa), [grant](https://github.com/grant), [remram44](https://github.com/remram44) and [ghoullier](https://github.com/ghoullier) for the many other good contributions.

### Screenshot

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1175750/8614312/280e5dc2-26f1-11e5-9f1f-5891c3ca8b26.png" alt="Screenshot"/>
</p>

That screenshot is fake, by the way. I never reached 2048 :smile:

## Contributing
Changes and improvements are more than welcome! Feel free to fork and open a pull request. Please make your changes in a specific branch and request to pull into `master`! If you can, please make sure the game fully works before sending the PR, as that will help speed up the process.

You can find the same information in the [contributing guide.](https://github.com/gabrielecirulli/2048/blob/master/CONTRIBUTING.md)

## License
2048 is licensed under the [MIT license.](https://github.com/gabrielecirulli/2048/blob/master/LICENSE.txt)

## Donations
I made this in my spare time, and it's hosted on GitHub (which means I don't have any hosting costs), but if you enjoyed the game and feel like buying me coffee, you can donate at my BTC address: `1Ec6onfsQmoP9kkL3zkpB6c5sA4PVcXU2i`. Thank you very much!
**在线试玩：** https://jean-boop-jy.github.io/2048/
