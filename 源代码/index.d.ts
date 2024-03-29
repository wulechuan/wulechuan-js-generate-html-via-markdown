import type {
    // 范_内建之层叠样式表文件之名称 as 范_peer依赖包_内建之层叠样式表文件之名称,
    范_内建之层叠样式表文件之名称之凡不含文章目录者 as 范_peer依赖包_内建之层叠样式表文件之名称之凡不含文章目录者,
    范_内建之层叠样式表文件之名称之凡含有文章目录者 as 范_peer依赖包_内建之层叠样式表文件之名称之凡含有文章目录者,
    范_文件简易描述项字典 as 范_peer依赖包_文件简易描述项字典,
    范_获取某特定文件之完整内容字符串之函数 as 范_peer依赖包_获取某特定文件之完整内容字符串之函数,
} from '@wulechuan/css-stylus-markdown-themes';





declare function 一枚现成的自Markdown至HTML的转换器 (
    ...args: Parameters<一枚现成的自Markdown至HTML的转换器.自Markdown至HTML的转换器>
): ReturnType<一枚现成的自Markdown至HTML的转换器.自Markdown至HTML的转换器>;

export = 一枚现成的自Markdown至HTML的转换器;





declare namespace 一枚现成的自Markdown至HTML的转换器 {
    export const 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器: 范_转换器之构建器;
    export const 完备的默认配置项集: 范_将Markdown字符串转换为HTML字符串之转换器之配置项集;





    export type 范_转换器之构建器 = (配置项集: 范_转换器之构建器之配置项集) => 自Markdown至HTML的转换器;

    export type 范_转换器之构建器之配置项集 = {
        peer依赖包提供的以文件名称为索引之所有文件简易描述项之字典: 范_peer依赖包_文件简易描述项字典;
        peer依赖包提供用以获取某特定文件之完整内容字符串之函数: 范_peer依赖包_获取某特定文件之完整内容字符串之函数;
        不应采纳本工具之源代码之缓存版本以应对本工具研发阶段之要求?: boolean;
        应输出MarkdownIt生态工具集之原始产出以便验证之而非输出正式内容?: boolean;
    };

    /**
     * 不应采用 “ typeof 一枚现成的自Markdown至HTML的转换器 ” 之写法。
     * 因为这一定义还额外包含了
     *     1） 构建一个用于将Markdown内容字符串转换为HTML字符串的转换器
     *     2） 完备的默认配置项集
     * 这两个属性。故而是不正确的。
     *
     * 恰恰相反，应对令上文 “ 一枚现成的自Markdown至HTML的转换器 ” 函数之定义尽可能采用下方之现成定义。此举已成。
     */
    // export type 自Markdown至HTML的转换器 = typeof 一枚现成的自Markdown至HTML的转换器;

    export type 自Markdown至HTML的转换器 = (
        markdown内容全文: string,
        配置项集?: 范_将Markdown字符串转换为HTML字符串之转换器之配置项集
    ) => string;

    export type 范_作用于原始Markdown内容之内建替换规则名称 = (
        | '去除Markdown中自有的用于引用内建层叠样式表文件之Style标签'
    );

    export type 范_作用于HTML内容之内建替换规则名称 = (
        | '令所有外部链接之打开方式为 _blank'
        | '令所有原本指向Markdown文件之链接改为指向同名HTML文件'
    );

    export type 范_作用于原始Markdown内容之额外替换规则项 = {
        凡: string | RegExp;
        替换为: string;
    };

    export type 范_作用于HTML内容之额外替换规则项 = 范_作用于原始Markdown内容之额外替换规则项;


    export type 范_内建现成的Markdown内容替换规则集字典 = {
        '去除Markdown中自有的用于引用内建层叠样式表文件之Style标签': 范_作用于原始Markdown内容之额外替换规则项;
        // [名称: string]: 范_作用于原始Markdown内容之额外替换规则项;
    };

    export type 范_内建现成的HTML内容替换规则集字典 = {
        '令所有外部链接之打开方式为 _blank': 范_作用于HTML内容之额外替换规则项;
        '令所有原本指向Markdown文件之链接改为指向同名HTML文件': 范_作用于HTML内容之额外替换规则项;
        // [名称: string]: 范_作用于HTML内容之额外替换规则项;
    };

    export type 范_将Markdown字符串转换为HTML字符串之转换器之配置项集 = {
        配置格式适用之最低版本?: number | string;

        须在控制台打印详尽细节?: boolean;

        将Markdown转换为HTML之前之预备阶段?: {
            不应主动插入TOC之占位标记?: boolean;
            须对原始Markdown内容字符串依次按下诸内容替换规则做修订?: {
                '1 内建现成的替换规则之名称之序列': Array<范_作用于原始Markdown内容之内建替换规则名称>;
                '2 额外的替换规则之定义之序列': Array<范_作用于原始Markdown内容之额外替换规则项>;
            };
        };

        将Markdown转换为HTML之阶段?: {
            不应为各章节标题构建超链接?: boolean;
            各章节标题超链接之符号字符串?: string;

            文章纲要列表应采用UL标签而非OL标签?: boolean;

            针对MarkdownIt生态之诸工具的层叠样式表类名集?: {
                用于各级标题之超链接A标签的?: string;
                用于文章纲要列表之容器的?: string;
                用于文章纲要列表各级UL或OL标签的?: string;
                用于文章纲要列表各级LI标签的?: string;
                用于文章纲要列表各级LI标签内嵌之A标签的?: string;
            };

            构建文章纲要列表时自该级别之标题始?: number;
        };

        对HTML做进一步处理之阶段?: {
            不应将代码块中的换行符替换成BR标签?: boolean;
            不应注入用于返回文章起始之按钮?: boolean;
            不应采用任何由本工具内建之层叠样式表?: boolean;
            采用由本工具内建之层叠样式表时应采用未经压缩之版本?: boolean;
            采用由本工具内建之Javascript时应采用未经压缩之版本?: boolean;

            读取本工具内建之层叠样式表文件和Javascript文件时应禁止采用Require语句对这些文件之缓存内容以确保计算机进程反复读取各文件时恒取到各文件最新之内容全文?: boolean;

            产出之HTML文件之HTML标签之语言属性之取值?: string;

            产出之HTML文件之Title标签之内容字符串?: string;

            所采用之由本工具内建之不含文章纲要列表之定义之层叠样式表文件之名称?: 范_peer依赖包_内建之层叠样式表文件之名称之凡不含文章目录者;
            所采用之由本工具内建之含有文章纲要列表之定义之层叠样式表文件之名称?: 范_peer依赖包_内建之层叠样式表文件之名称之凡含有文章目录者;

            本工具专门可配置的层叠样式表类名集?: {
                用于Body标签以表明文章配备了纲要列表的?: string;
                用于文章正文之根Article标签的?: string;
                用于具有按钮样貌的返回文章首部之链接的?: string;
            };

            须对产出之HTML内容字符串依次遵照下列诸内容替换规则做修订?: {
                '1 内建现成的替换规则之名称之序列'?: Array<范_作用于HTML内容之内建替换规则名称>;
                '2 额外的替换规则之定义之序列'?: Array<范_作用于HTML内容之额外替换规则项>;
            };

            凡内容须注入产出之HTML中之所有外来文件?: {
                依次给出之外来文件之绝对路径序列?: string[];
                应禁止采用Require语句对这些文件之缓存内容以确保计算机进程反复读取各文件时恒取用各文件最新之内容全文?: boolean;
            };
        };

        对本工具现成提供的文章纲要做以下配置?: {
            为求文章纲要列表简洁明了故意仅显示两层条目以至于较深层级条目形同作废?: boolean;
            浏览器打开HTML文章最初之时文章纲要列表中凡层级深于该值之条目均应收叠?: number;
            浏览器打开HTML文章最初之时若浏览器窗口足够宽大则直接展开文章纲要列表之面板?: boolean;
        };

        杂项?: {
            控制台打印信息须改用英国话?: boolean;
        };
    };
}
