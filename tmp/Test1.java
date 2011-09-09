import java.math.BigInteger;

class Test1 {
	public static void main(String[] args) {
		write_add();
		System.out.println("");
		write_sub();
		System.out.println("");
		write_mul();
		System.out.println("");
		write_divmod();
	}

	public static void write_add() {
		gen_add("0", "0");
		gen_add("123", "0");
		gen_add("-123", "0");
		gen_add("0", "123");
		gen_add("0", "-123");
		gen_add("123", "987");
		gen_add("-123", "987");
		gen_add("987", "123");
		gen_add("987", "-123");
		gen_add("123", "-987");
		gen_add("-123", "-987");
		gen_add("-987", "123");
		gen_add("-987", "-123");
		gen_add("1234567890123456789012345678901234567890", "0");
		gen_add("-1234567890123456789012345678901234567890", "0");
		gen_add("0", "1234567890123456789012345678901234567890");
		gen_add("0", "-1234567890123456789012345678901234567890");
		gen_add("1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_add("-1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_add("9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_add("9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		gen_add("1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_add("-1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_add("-9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_add("-9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		{
			String T = "54321";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.add(new BigInteger(""+i));
			write_func("add", T, N.toString(), "i");
		}
		{
			String T = "1234567";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.add(new BigInteger(""+i));
			write_func("add", T, N.toString(), "i");
		}
		{
			String T = "2147483648";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.add(new BigInteger(""+i+i));
			write_func("add", T, N.toString(), "''+i+i");
		}
		{
			String T = "1234567890123456789012345678901234567890";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.add(new BigInteger(""+i+i+i+i+i+i+i+i+i+i));
			write_func("add", T, N.toString(), "''+i+i+i+i+i+i+i+i+i+i");
		}
	}
	public static void write_sub() {
		gen_sub("0", "0");
		gen_sub("123", "0");
		gen_sub("-123", "0");
		gen_sub("0", "123");
		gen_sub("0", "-123");
		gen_sub("123", "987");
		gen_sub("-123", "987");
		gen_sub("987", "123");
		gen_sub("987", "-123");
		gen_sub("123", "-987");
		gen_sub("-123", "-987");
		gen_sub("-987", "123");
		gen_sub("-987", "-123");
		gen_sub("1234567890123456789012345678901234567890", "0");
		gen_sub("-1234567890123456789012345678901234567890", "0");
		gen_sub("0", "1234567890123456789012345678901234567890");
		gen_sub("0", "-1234567890123456789012345678901234567890");
		gen_sub("1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_sub("-1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_sub("9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_sub("9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		gen_sub("1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_sub("-1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_sub("-9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_sub("-9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		{
			String T = "54321";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.subtract(new BigInteger(""+i));
			write_func("sub", T, N.toString(), "i");
		}
		{
			String T = "1234567";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.subtract(new BigInteger(""+i));
			write_func("sub", T, N.toString(), "i");
		}
		{
			String T = "2147483648";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.subtract(new BigInteger(""+i+i));
			write_func("sub", T, N.toString(), "''+i+i");
		}
		{
			String T = "1234567890123456789012345678901234567890";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 10000; ++i) N = N.subtract(new BigInteger(""+i+i+i+i+i+i+i+i+i+i));
			write_func("sub", T, N.toString(), "''+i+i+i+i+i+i+i+i+i+i");
		}
	}
	public static void write_mul() {
		gen_mul("0", "0");
		gen_mul("123", "0");
		gen_mul("-123", "0");
		gen_mul("0", "123");
		gen_mul("0", "-123");
		gen_mul("123", "987");
		gen_mul("-123", "987");
		gen_mul("987", "123");
		gen_mul("987", "-123");
		gen_mul("123", "-987");
		gen_mul("-123", "-987");
		gen_mul("-987", "123");
		gen_mul("-987", "-123");
		gen_mul("1234567890123456789012345678901234567890", "0");
		gen_mul("-1234567890123456789012345678901234567890", "0");
		gen_mul("0", "1234567890123456789012345678901234567890");
		gen_mul("0", "-1234567890123456789012345678901234567890");
		gen_mul("1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_mul("-1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_mul("9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_mul("9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		gen_mul("1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_mul("-1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_mul("-9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_mul("-9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		{
			String T = "54321";
			BigInteger N = new BigInteger(T);
			for (int i = 1; i <= 1000; ++i) N = N.multiply(new BigInteger(""+i));
			write_func("mul", T, N.toString(), "i");
		}
	}
	public static void write_divmod() {
		gen_divmod("0", "123");
		gen_divmod("0", "-123");
		gen_divmod("123", "987");
		gen_divmod("-123", "987");
		gen_divmod("123", "-987");
		gen_divmod("-123", "-987");
		gen_divmod("987", "123");
		gen_divmod("987", "-123");
		gen_divmod("-987", "123");
		gen_divmod("-987", "-123");
		gen_divmod("1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_divmod("-1234567890123456789012345678901234567890", "9876543210987654321098765432109876543210");
		gen_divmod("1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_divmod("-1234567890123456789012345678901234567890", "-9876543210987654321098765432109876543210");
		gen_divmod("9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_divmod("9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		gen_divmod("-9876543210987654321098765432109876543210", "1234567890123456789012345678901234567890");
		gen_divmod("-9876543210987654321098765432109876543210", "-1234567890123456789012345678901234567890");
		gen_divmod("9876543210987654321098765432109876543210", "12345678901234567890");
		gen_divmod("9876543210987654321098765432109876543210", "-12345678901234567890");
		gen_divmod("-9876543210987654321098765432109876543210", "12345678901234567890");
		gen_divmod("-9876543210987654321098765432109876543210", "-12345678901234567890");
	}

	public static void gen_add(String a_str, String b_str) {
		BigInteger a = new BigInteger(a_str);
		BigInteger b = new BigInteger(b_str);
		BigInteger r = a.add(b);
		System.out.println("gen_add('" + a.toString() + "', '" + b.toString() + "', '" + r.toString() + "'),");
	}
	public static void gen_sub(String a_str, String b_str) {
		BigInteger a = new BigInteger(a_str);
		BigInteger b = new BigInteger(b_str);
		BigInteger r = a.subtract(b);
		System.out.println("gen_sub('" + a.toString() + "', '" + b.toString() + "', '" + r.toString() + "'),");
	}
	public static void gen_mul(String a_str, String b_str) {
		BigInteger a = new BigInteger(a_str);
		BigInteger b = new BigInteger(b_str);
		BigInteger r = a.multiply(b);
		System.out.println("gen_mul('" + a.toString() + "', '" + b.toString() + "', '" + r.toString() + "'),");
	}
	public static void gen_divmod(String a_str, String b_str) {
		BigInteger a = new BigInteger(a_str);
		BigInteger b = new BigInteger(b_str);
		BigInteger[] r = a.divideAndRemainder(b);
		System.out.println("gen_divmod('" + a.toString() + "', '" + b.toString() + "', '" + r[0].toString() + "', '" + r[1].toString() + "'),");
	}

	public static void write_func(String method, String seed, String result, String value) {
		int count = method.equals("mul") ? 1000 : 10000;
		System.out.println("function () {");
		System.out.println("\t" + "var N = new Bigint('" + seed + "');");
		System.out.println("\t" + "for (var i = 1; i <= " + count + "; ++i) N = N." + method + "(new Bigint(" + value + "));");
		System.out.println("\t" + "return [ [ N, new Bigint('" + result + "') ] ];");
		System.out.println("},");
	}
}
