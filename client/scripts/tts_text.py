#!/usr/bin/env python3
"""
TTS 朗读文本规范化

讲解稿里的数学符号是给「看」的(字幕要显示 π/4、x² + y²、t = 0.5),
但 edge-tts 对它们的处理不可靠: 实测 `π/4` 比口语版短 0.46s —— 斜杠
被整个吞掉, 听起来是「派四」。上标 ² 也时常不发音。

所以朗读前把符号换成中文口语说法, 而 manifest 里仍记录原始显示文本,
这样「稿件 ↔ manifest」始终可以逐字校验一致性。

只做保守替换: 拿不准的符号宁可保留原样, 也不要造出比原文更难懂的读法。
"""

import re

# 希腊字母: 按国内数学课的通常读法
GREEK = {
    'π': '派', 'θ': '西塔', 'φ': '斐', 'λ': '拉姆达', 'μ': '缪',
    'σ': '西格玛', 'α': '阿尔法', 'β': '贝塔', 'γ': '伽马',
    'Δ': '德尔塔', 'δ': '德尔塔', 'ω': '欧米伽', 'ρ': '柔',
    'τ': '陶', 'ε': '艾普西龙', 'ζ': '泽塔', 'Σ': '西格玛求和',
    '∇': '梯度算子', '∂': '偏',
}

# 上标: 统一读作「的 N 次方」, 平方/立方用更自然的说法
SUPERSCRIPT = {
    '²': '的平方', '³': '的立方', '⁴': '的四次方',
    'ⁿ': '的 n 次方', '¹': '', '⁰': '的零次方',
}

# 运算符与关系符
OPERATORS = [
    ('≠', ' 不等于 '), ('≈', ' 约等于 '), ('≤', ' 小于等于 '),
    ('≥', ' 大于等于 '), ('±', ' 正负 '), ('×', ' 乘 '), ('÷', ' 除以 '),
    ('∈', ' 属于 '), ('∉', ' 不属于 '), ('⊂', ' 包含于 '),
    ('∪', ' 并 '), ('∩', ' 交 '), ('∅', ' 空集 '),
    ('∞', ' 无穷 '), ('∫', ' 积分 '), ('∏', ' 连乘 '), ('√', ' 根号 '),
    ('½', ' 二分之一 '), ('¼', ' 四分之一 '),
]


def _fractions(text: str) -> str:
    """
    a/b → b 分之 a。中文习惯先说分母, 「1/n」读「n 分之一」。
    只处理两侧都是短标识符(数字/单字母/带上标)的情况, 免得把日期或
    路径也改掉。
    """
    def repl(m: re.Match) -> str:
        num, den = m.group(1), m.group(2)
        return f'{den} 分之 {num}'

    # 分子分母限定为「纯数字」或「单个字母/希腊字母(可带上标)」。
    # 这样 1/n、π/4、1/n²、1/ε 都能读对, 而 SSL/TLS、and/or 这类
    # 多字母缩写不满足条件, 保持原样念字母。
    term = r'(?:[0-9]{1,3}|[A-Za-zͰ-Ͽ][²³ⁿ]?)'
    return re.sub(
        rf'(?<![0-9A-Za-z/])({term})\s*/\s*({term})(?![0-9A-Za-z/])',
        repl, text)


def _conditional(text: str) -> str:
    """
    P(A|B) → P A 在 B 条件下。竖线在概率里念「在…条件下」,
    直接读会被 TTS 吞掉, 听众只听到「P A B」完全不知所云。
    """
    return re.sub(
        r'([A-Za-z])\s*\(\s*([^()|]{1,8})\s*\|\s*([^()|]{1,8})\s*\)',
        lambda m: f'{m.group(1)} {m.group(3)} 条件下的 {m.group(2)}',
        text,
    )


def _minus(text: str) -> str:
    """
    n-1 → n 减 1。只在两侧都是单个数字/字母时替换, 这样
    Catmull-Rom、SHA-256 这类含连字符的专名不会被拆开念。
    """
    return re.sub(r'(?<![\w-])([0-9a-zA-Z])\s*-\s*([0-9])(?![\w-])',
                  r'\1 减 \2', text)


def normalize_for_tts(text: str) -> str:
    """把讲解文本转成适合朗读的说法。纯文本无符号时原样返回。"""
    out = _conditional(text)
    out = _fractions(out)
    # 分母是整个括号表达式时(如 ω/(s²+ω²)), 按「除以」念更清楚,
    # 硬套「…分之…」会把长括号提到前面, 反而听不懂
    out = re.sub(r'(?<=[0-9A-Za-zͰ-Ͽ²³ⁿ)])\s*/\s*(?=\()', ' 除以 ', out)
    out = _minus(out)

    # 等号: 「t = 0」读「t 等于 0」; 前后已有中文「等于」的不重复加
    out = re.sub(r'\s*=\s*', ' 等于 ', out)
    # 左右两侧都允许上标/括号/中文 —— 前面的规则可能已经把相邻 token
    # 换成了中文(如 ² → 的平方), 断言必须把中文也算作合法的操作数
    operand_l = r'[0-9a-zA-Z一-鿿Ͱ-Ͽ²³ⁿ)）]'
    operand_r = r'[0-9a-zA-Z一-鿿Ͱ-Ͽ(（]'
    out = re.sub(rf'(?<={operand_l})\s*\+\s*(?={operand_r})', ' 加 ', out)
    out = re.sub(rf'(?<={operand_l})\s*<\s*(?={operand_r})', ' 小于 ', out)
    out = re.sub(rf'(?<={operand_l})\s*>\s*(?={operand_r})', ' 大于 ', out)
    # |x| → x 的模长(绝对值)。只处理成对且内部不含竖线的情况
    out = re.sub(r'\|([^|]{1,20})\|', r'\1 的模长', out)

    for sym, say in OPERATORS:
        out = out.replace(sym, say)
    for sym, say in SUPERSCRIPT.items():
        out = out.replace(sym, say)
    for sym, say in GREEK.items():
        out = out.replace(sym, say)

    out = out.replace('°', ' 度 ')
    # 成对引号朗读时无意义, 去掉避免 TTS 插入停顿
    out = re.sub(r'["“”「」]', '', out)
    # 折叠多余空白
    return re.sub(r'\s{2,}', ' ', out).strip()
