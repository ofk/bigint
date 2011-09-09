(function (Global) {

var
// RADIX進数でデータを格納する。RADIXの値は2の乗数とする。
// 繰り上がり計算時の剰余算をビット演算で行うためである。
// 15ビットとするのは乗算でオーバーフローを起こさないためである。
RADIX_BIT    = 15,             //< 進数のビット数
RADIX        = 1 << RADIX_BIT, //< 進数の値
RADIX_MASK   = RADIX - 1;      //< 進数のビットマスク
// 2進数から36進数までの入出力を行うためのテーブル
DIGITS_ARRAY = [], //< 出力用（文字列→数値）
DIGITS_TABLE = {}; //< 入力用（数値→文字列）
(function (DIGITS_ARRAY, DIGITS_TABLE, DIGITS_CHARS) {
	for (var i = 0, iz = DIGITS_CHARS.length; i < iz; ++i) {
		var c = DIGITS_CHARS[i];
		DIGITS_ARRAY[i] = c; // ex. 10 => 'a'
		DIGITS_TABLE[c] = i; // ex. 'a' => 10
	}
})(DIGITS_ARRAY, DIGITS_TABLE, '0123456789abcdefghijklmnopqrstuvwxyz');

function Bigint() { this.init.apply(this, arguments); }

Bigint.prototype = {
	// コンストラクタ
	init: function (obj) {
		this._digits = [];  //< 各桁を表す配列。0は空データとする。
		this._used = 0;     //< 実際に利用している_digits数
		this._sign = false; //< false: positive, true: negative

		// 入力があれば実体を生成
		if (obj != null) {
			var typeof_obj = typeof obj;
			// 文字列から変換
			if (typeof_obj === 'string') {
				this._setFromString(obj);
			}
			// 数字から変換
			else if (typeof_obj === 'number') {
				// int32の範囲内ならビット演算が使える
				if (-0x7fffffff <= obj && obj <= 0x7fffffff) {
					this._setFromInt(obj);
				}
				// それ以外は文字列として処理
				else {
					this._setFromString(String(obj));
				}
			}
			// Bigintのコピー
			else if (typeof_obj === 'object' && obj instanceof Bigint) {
				obj.clone(this);
			}
		}
	},

	// 文字列から設定
	// 適当なので改良の余地いっぱい
	_setFromString: function (str, radix) {
		str = str.replace(/\s+/g, '').toLowerCase();
		// 浮動小数表現の展開
		var m;
		if (m = /^(-?[0-9]+)(?:\.([0-9]*))?e\+([0-9]+)/.exec(str)) {
			var zeros = parseInt(m[3]);
			// 小数部の処理（切り捨てるが浮動小数と見たとき整数部になるところは数値に組み込む）
			if (m[2]) {
				str = m[1] + m[2];
				zeros -= m[2].length;
				if (zeros < 0) {
					str = str.slice(0, zeros) || '0';
				}
			}
			else {
				str = m[1];
			}
			while (zeros-- > 0) {
				str += '0';
			}
		}
		// 2進数、8進数、16進数への対応
		if (m = /^(-)?(0[box]?)?/.exec(str)) {
			this._sign = !!m[1];
			this._setFromStringNatural(
				str.slice(m[0].length)
				   .replace(/^\./, '0.')
				   .replace(/\.[0-9]*/, ''), //< 多倍長整数計算なので小数点以下は切り捨てる
				radix || { '0b': 2, '0': 8, '0o': 8, '0x': 16 }[m[2]]
			);
		}
	},

	// 自然数文字列からの設定
	_setFromStringNatural: function (str, radix) {
		// 基数対応（小文字のみ）
		radix = radix || 10;
		if (radix < 2 || 36 < radix) {
			throw new RangeError('_setFromStringNatural() radix argument must be between 2 and 36');
		}

		var chs = str.split(''), digits = this._digits;

		// 進数ごとに展開する
		for (var i = 0, iz = chs.length; i < iz; ++i) {
			for (var j = 0, jz = digits.length, curry = DIGITS_TABLE[chs[i]]; j < jz || curry; ++j) {
				curry += (digits[j] || 0) * radix; //< 指定された基数ごとに位を大きくする
				digits[j] = (curry & RADIX_MASK);
				curry >>>= RADIX_BIT; //< 繰り上げ処理
			}
		}
		this._used = digits.length;
	},

	// 整数から設定
	_setFromInt: function (num) {
		if (num < 0) {
			num = -num;
			this._sign = true;
		}
		else {
			this._sign = false;
		}
		num &= 0x7fffffff; //< 32bit整数に正規化

		var used = 0, digits = this._digits;

		while (num) {
			digits[used++] = num & RADIX_MASK;
			num >>>= RADIX_BIT;
		}
		this._used = used;
	},

	// 比較
	equals: function (other) {
		if (this._sign !== other._sign
		 || this._used !== other._used) {
			return false;
		}

		for (var i = 0, iz = this._used; i < iz; ++i) {
			if (this._digits[i] !== other._digits[i]) {
				return false;
			}
		}
		return true;
	},

	// 大小比較
	compareTo: function (other) {
		// 正負が違う時
		if (this._sign !== other._sign) {
			return other._sign ? 1 : -1;
		}
		return this.compareToAbsolute(other);
	},
	// 絶対値の大小比較
	// 最上位が0にも関わらず有効桁とみなすデータが来るとバグる
	compareToAbsolute: function (other) {
		// 桁が違う時
		if (this._used !== other._used) {
			return this._used > other._used ? 1 : -1;
		}

		// 位ごとに比較を行う
		for (var i = this._used - 1; i >= 0; --i) {
			var this_digit = this._digits[i],
			    other_digit = other._digits[i];
			if (this_digit !== other_digit) {
				return this_digit > other_digit ? 1 : -1;
			}
		}

		return 0;
	},

	// コピー
	clone: function (obj) {
		obj = obj || new Bigint;
		obj._sign = this._sign;
		obj._used = this._used;
		obj._digits = this._digits.concat();
		return obj;
	},

	// 正規化
	// 最上位桁の0を無視したusedを設定しなおす
	// usedが最上位桁より小さい値の場合、動作しない
	_normalize: function () {
		for (var i = this._used - 1, digits = this._digits; !digits[i] && i >= 0; --i, --this._used);
		// 0なら符号を消す
		if (!this._used) {
			this._sign = false;
		}
		return this;
	},

	// 強制的に数値に
	toNumber: function () {
		var rv = 0;
		for (var i = this._used - 1; i >= 0; --i) {
			rv *= RADIX;
			rv += this._digits[i];
		}
		return this._sign ? -rv : rv;
	},

	// 文字列に
	toString: function (radix) {
		radix = radix || 10;
		if (radix < 2 || 36 < radix) {
			throw new RangeError('toString() radix argument must be between 2 and 36');
		}

		// 0は別処理
		if (this.isZero()) {
			return '0';
		}

		// 基数変換を行う
		// TODO: もうちょっと筋の良いやり方がありそう。
		var tmp_digits = [ 0 ];
		for (var i = this._used - 1; i >= 0; --i) {
			tmp_digits[0] += this._digits[i];

			for (var j = 0, jz = tmp_digits.length, tmp_curry = 0; j < jz || tmp_curry; ++j) {
				var tmp_digit = tmp_digits[j] || 0;
				if (i) tmp_digit *= RADIX;
				tmp_digit += tmp_curry;
				tmp_curry = (tmp_digit / radix) | 0;
				tmp_digits[j] = tmp_digit % radix;
			}
		}

		var rv = this._sign ? '-' : '';

		// 10進数以下は逆順で結合
		if (radix <= 10) {
			return rv + tmp_digits.reverse().join('');
		}

		// テーブルを使って進数変換
		for (var i = tmp_digits.length - 1; i >= 0; --i) {
			rv += DIGITS_ARRAY[tmp_digits[i]];
		}
		return rv;
	},

	// 正負の取得
	isNegative: function () {
		return this._sign;
	},
	// 0かどうか
	isZero: function () {
		return !this._used;
	},

	// 正負反転
	negate: function () {
		var that = this.clone();
		that._sign = !that._sign;
		return that;
	},

	// 加減算
	// |a| > |b| である
	_addsub: function (other, other_sign) {
		// 絶対値の比較を行い大きい方をa、小さい方をbとする。aは破壊可能。
		var a, b,
		    cmp_digits = this.compareToAbsolute(other),
		    cmp_sign = this._sign === other_sign;
		// a > b
		if (cmp_digits > 0) {
			a = this.clone();
			b = other;
		}
		// a < b
		else if (cmp_digits < 0 || cmp_sign) {
			a = other.clone();
			a._sign = other_sign;
			b = this;
		}
		// |a| = |b|, a = -b
		else {
			return new Bigint(0); //< 数字が同じで符号が異なるなら結果は0となる
		}

		// a + 0 = a
		if (b.isZero()) {
			return a;
		}

		var i = 0, iz = b._used,
		    a_digits = a._digits,
		    b_digits = b._digits;
		// 符号が同じ場合
		if (cmp_sign) {
			// 単純に足し合わせて終わり
			// くり上がりの可能性を考えて大きい方の一番上の位を拡張する。
			a_digits[a._used++] = 0;
			for (var curry = 0; i < iz || curry; ++i) {
				curry += b_digits[i] || 0;
				if (curry) {
					curry += a_digits[i];
					a_digits[i] = curry & RADIX_MASK;
					curry >>>= RADIX_BIT;
				}
			}
		}
		// 符号が異なる場合
		else {
			// 大きい方から小さい方を引いて、大きい方の符号を設定する
			for (; i < iz; ++i) {
				a_digits[i] -= b_digits[i];
				if (a_digits[i] < 0) {
					a_digits[i] += RADIX;
					--a_digits[i + 1];
				}
			}
		}

		return a._normalize();
	},
	// 加算
	add: function (other) {
		return this._addsub(other, other._sign);
	},
	// 減算
	sub: function (other) {
		return this._addsub(other, !other._sign);
	},

	// 乗算
	// q = m * n
	// m: a+b+c, n: x+y+zのとき
	// (a+b+c) * (x+y+z) = ax + ay + az
	//                   + bx + by + bz
	//                   + cx + cy + cz
	// それぞれの組み合わせの積の和であることを利用する
	mul: function (other) {
		var m_length = this._used,
		    m_digits = this._digits,
		    n_length = other._used,
		    n_digits = other._digits;
		var q = new Bigint,
		    q_length = q._used = m_length + n_length + 1,
		    q_digits = q._digits = new Array(q_length);
		q._sign = this._sign !== other._sign;

		while (q_length--) q_digits[q_length] = 0;

		// 桁が進むことは値はRADIX倍になる
		// 書きこみ先はRADIX倍になることも考慮するからi + jとなる
		for (var i = 0; i < m_length; ++i) {
			var m = m_digits[i];
			if (m) {
				var j = 0, curry = 0;
				for (; j < n_length; ++j) {
					curry += m * n_digits[j];
					if (curry) {
						curry += q_digits[i + j];
						q_digits[i + j] = curry & RADIX_MASK;
						curry >>>= RADIX_BIT;
					}
				}
				q_digits[i + j] = curry;
			}
		}

		return q._normalize();
	},

	// 除と剰余
	// M > N であるとき
	// +M / +N = +Q ... +R
	// +M / -N = -Q ... +R
	// -M / +N = -Q ... -R
	// -M / -N = +Q ... -R
	// +N / +M =  0 ... +N
	// +N / -M =  0 ... +N
	// -N / +M =  0 ... -N
	// -N / -M =  0 ... -N
	_divmod: function (other, mode) {
		// ゼロ除算エラー
		if (other.isZero()) {
			throw new Error('_divmod() division by zero');
		}

		var cmp_digits = this.compareToAbsolute(other);

		// 同一数での除算
		if (cmp_digits === 0) {
			var q = this._sign === other._sign ? 1 : -1;
			switch (mode) {
				case 0: return new Bigint(q);
				case 1: return new Bigint(0);
			}
			return [ new Bigint(q), new Bigint(0) ];
		}

		// 割る値の方が大きい場合
		if (cmp_digits < 0) {
			switch (mode) {
				case 0: return new Bigint(0);
				case 1: return this.clone();
			}
			return [ new Bigint(0), this.clone() ];
		}

		// otherが一桁なら高速に処理
		// あとで作る。

		// m / n = r ... q
		// mを破壊しながらrを算出するので、mのコピーをrとする
		var q = new Bigint,
		    r = this.clone(), //< 実体はm
		    r_highest = r._digits[r._used - 1],
		    n = other.clone(),
		    n_highest = n._digits[n._used - 1],
		    t = (r_highest / n_highest) & RADIX_MASK;
		q._sign = r._sign !== n._sign;
		q._used = r._used - n._used + 1;
		// 答えの一時解が0なら、桁をずらして再計算する
		if (!t) {
			--q._used;
			t = ((r_highest * RADIX + r._digits[r._used - 2]) / n_highest) & RADIX_MASK;
		}
		q._digits = new Array(q._used); //< 適当に確保する

		// 符号を揃える
		r._sign = false;
		n._sign = false;

		for (var i = q._used - 1; i >= 0; --i, t = ((r._digits[r._used - 1] * RADIX + r._digits[r._used - 2]) / n_highest) & RADIX_MASK) {
			var w;
			for (;; --t) { //< 一時解tが大きい場合は減らす
				w = n.mul(new Bigint(t));
				w._used += i;
				for (var j = 0, jz = i; j < jz; ++j) w._digits.unshift(0);
				if (w.compareToAbsolute(r) <= 0) break;
			}
			q._digits[i] = t;
			r = r.sub(w);
/*
			var w_digits = [];
			var j = 0, curry = 0, length = n._used + 1;
			for (; j < length; ++j) {
				curry += n._digits[j] * t;
				if (curry) {
					curry += w_digits[i] || 0;
					w_digits[i] = curry & RADIX_MASK;
					curry >>>= RADIX_BIT;
				}
			}


/*
				for (; j < n_length; ++j) {
					curry += m * n_digits[j];
					if (curry) {
						curry += q_digits[i + j];
						q_digits[i + j] = curry & RADIX_MASK;
						curry >>>= RADIX_BIT;
					}
				}
				q_digits[i + j] = curry;
			
			/*
			var w = n.mul(new Bigint(t));
			while (true) {
				var w_used = w._used + i,
				    r_used = r._used;
				if (w_used < r_used) break;
				if (w_used === r_used) {
					
				}
				w = w.sub(n);
				for (var j = w_used - 1; j >= 0; --j) {
					var w_digit = w._digits[j],
					    r_digit = r._digits[j];
					if (this_digit !== other_digit) {
						return this_digit > other_digit ? 1 : -1;
					}
				}
				break;
			}



		// 位ごとに比較を行う
		for (var i = this._used - 1; i >= 0; --i) {
			var this_digit = this._digits[i],
			    other_digit = other._digits[i];
			if (this_digit !== other_digit) {
				return this_digit > other_digit ? 1 : -1;
			}
		}




			for (var j = 0, jz = w._used; j < jz; ++j) {
				r._digits[j] -= w._digits[j];
				if (r._digits[j] < 0) {
					r._digits[j] += RADIX;
					--r._digits[j + 1];
				}
			}
			*/
		}

		if (mode === 0) {
			return q._normalize();
		}
		r._sign = this._sign;
		if (mode === 1) {
			return r._normalize();
		}
		return [ q._normalize(), r._normalize() ];
	},

	// 除と剰余
	divmod: function (other) {
		return this._divmod(other, -1);
	},
	// 除
	div: function (other) {
		return this._divmod(other, 0);
	},
	// 剰余
	mod: function (other) {
		return this._divmod(other, 1);
	},

/*
	// this^n%m
	modpow: function () {},

	// 累乗
	pow: function () {},

	// ユーティリティ的
	// 大小比較
	max: function () {},

	min: function () {},

	gcd: function () {}
*/

};

Global.Bigint = Bigint;

})(this);
