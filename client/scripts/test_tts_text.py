#!/usr/bin/env python3
"""tts_text.normalize_for_tts 的单元测试

重点覆盖两类风险:
1. 该转的没转 —— 符号被 edge-tts 吞掉, 听众听到断句错乱的公式
2. 不该转的乱转 —— SSL/TLS、Catmull-Rom、SHA-256 这类专名被拆成算式

用法: python3 scripts/test_tts_text.py
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from tts_text import normalize_for_tts  # noqa: E402


class TestFractions(unittest.TestCase):
    def test_simple_fraction_reads_denominator_first(self):
        self.assertEqual(normalize_for_tts('1/n'), 'n 分之 1')

    def test_fraction_with_superscript(self):
        self.assertEqual(normalize_for_tts('1/n²'), 'n的平方 分之 1')

    def test_fraction_with_greek(self):
        self.assertIn('艾普西龙 分之 1', normalize_for_tts('(1/ε)'))

    def test_pi_over_four(self):
        self.assertEqual(normalize_for_tts('π/4'), '4 分之 派')

    def test_parenthesised_denominator_uses_divide(self):
        # 分母是长括号时提到前面反而难懂, 应念「除以」
        self.assertIn('除以 (', normalize_for_tts('ω/(s²+ω²)'))


class TestNonMathSlashUntouched(unittest.TestCase):
    def test_protocol_names_kept(self):
        self.assertEqual(normalize_for_tts('SSL/TLS加密'), 'SSL/TLS加密')

    def test_hyphenated_names_kept(self):
        self.assertEqual(normalize_for_tts('Catmull-Rom 样条'), 'Catmull-Rom 样条')

    def test_algorithm_version_kept(self):
        self.assertEqual(normalize_for_tts('SHA-256 最安全'), 'SHA-256 最安全')


class TestOperators(unittest.TestCase):
    def test_equals(self):
        self.assertEqual(normalize_for_tts('t = 0.5'), 't 等于 0.5')

    def test_plus_between_superscripts(self):
        self.assertEqual(normalize_for_tts('x² + y²'), 'x的平方 加 y的平方')

    def test_plus_after_greek(self):
        self.assertNotIn('+', normalize_for_tts('sin²θ + cos²θ = 1'))

    def test_minus_between_short_terms(self):
        self.assertEqual(normalize_for_tts('n-1 次方'), 'n 减 1 次方')

    def test_comparison(self):
        out = normalize_for_tts('Δ > 0 两根，Δ < 0 无实根')
        self.assertNotIn('>', out)
        self.assertNotIn('<', out)


class TestSpecialNotation(unittest.TestCase):
    def test_conditional_probability(self):
        self.assertEqual(normalize_for_tts('P(A|B)'), 'P B 条件下的 A')

    def test_absolute_value(self):
        self.assertIn('的模长', normalize_for_tts('|det J| 乘 dudv'))

    def test_greek_letters(self):
        self.assertEqual(normalize_for_tts('半径乘 θ'), '半径乘 西塔')

    def test_degree(self):
        self.assertIn('度', normalize_for_tts('45°'))

    def test_quotes_removed(self):
        self.assertEqual(normalize_for_tts('勾选"显示构造"'), '勾选显示构造')


class TestIdempotenceAndPlainText(unittest.TestCase):
    def test_plain_chinese_unchanged(self):
        text = '蝴蝶的左边和右边长得一模一样。'
        self.assertEqual(normalize_for_tts(text), text)

    def test_no_double_spaces(self):
        self.assertNotIn('  ', normalize_for_tts('a  =  b  +  c'))

    def test_second_pass_is_stable(self):
        once = normalize_for_tts('当 t = 0.5 时，1/n² 递减')
        self.assertEqual(normalize_for_tts(once), once)


if __name__ == '__main__':
    unittest.main(verbosity=2)
