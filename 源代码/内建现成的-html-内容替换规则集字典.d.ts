import type {
    类型定义之作用于HTML内容之额外替换规则项,
} from '.'



declare const 内建现成的HTML内容替换规则集字典: 内建现成的HTML内容替换规则集字典.类型定义之该字典;

export = 内建现成的HTML内容替换规则集字典;

declare namespace 内建现成的HTML内容替换规则集字典 {
    export type 类型定义之该字典 = {
        '令所有外部链接之打开方式为 _blank': 类型定义之作用于HTML内容之额外替换规则项;
        '令所有原本指向Markdown文件之链接改为指向同名HTML文件': 类型定义之作用于HTML内容之额外替换规则项;
        // [名称: string]: 类型定义之作用于HTML内容之额外替换规则项;
    };
}
