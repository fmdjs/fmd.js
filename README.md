# fmd.js

**fmd**是**Formatting Module Definition**的首字母缩写，中文意思是格式化模块定义，很明显，这套用了著名的Async Module Definition的说法。顾名思义，fmd.js的重点在于fotmatting，而非async，或其他

fmd.js所提供的模块管理是针对**语言层**而言的，是一种**语法机制**，而非文件层的。所以，尽管fmd.js也提供了异步加载文件的功能，但并不定位是模块加载器，更不是文件加载器

fmd.js认为模块化是代码之本，一切代码均在模块中，一切皆模块，而定义模块的途径最好有且只有一种。故，在fmd.js，只有**define**这一途径来定义模块

经fmd.js所定义的模块根据id的有无分别称为具名模块和匿名模块，具名模块很容易通过其id被其他模块引用，而匿名模块像匿名函数一样无法被其他模块引用，所以，匿名模块一经定义将立即执行其工厂函数

fmd.js基本兼容AMD规范

# Docs and Website

see http://fmdjs.org/

# License

Licensed under the [MIT license](http://fmdjs.org/LICENSE.txt).
