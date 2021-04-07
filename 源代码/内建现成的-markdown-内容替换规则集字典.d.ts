import type {
    类型定义之作用于原始Markdown内容之额外替换规则项,
} from '..'



declare const 内建现成的Markdown内容替换规则集字典: 内建现成的Markdown内容替换规则集字典.类型定义之该字典;

export = 内建现成的Markdown内容替换规则集字典;

declare namespace 内建现成的Markdown内容替换规则集字典 {
    export type 类型定义之该字典 = {
        '去除Markdown中自有的用于引用内建层叠样式表文件之Style标签': 类型定义之作用于原始Markdown内容之额外替换规则项;
        // [名称: string]: 类型定义之作用于原始Markdown内容之额外替换规则项;
    };    
}
